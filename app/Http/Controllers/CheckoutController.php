<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Promotion;
use App\Services\GeniusPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private const SUPPORTED_PAYMENT_PROVIDERS = [
        'wave_ci',
        'orange_money_ci',
        'mtn_money_ci',
    ];

    private function validationError(string $field, string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => [
                $field => [$message],
            ],
        ], 422);
    }

    public function index()
    {
        return $this->create();
    }

    public function create()
    {
        $user = auth()->user();

        $addresses = $user
            ->addresses()
            ->orderByDesc('is_default')
            ->latest()
            ->get();

        return Inertia::render('Checkout', [
            'user' => $user,
            'addresses' => $addresses,
        ]);
    }

    public function confirmation(Order $order)
    {
        $user = auth()->user();

        if (($user->role ?? 'client') !== 'admin' && $order->user_id !== $user->id) {
            abort(404);
        }

        $order->load([
            'items.product',
            'statusHistories.changedBy',
        ]);

        return Inertia::render('Orders/Confirmation', [
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_id' => [
                'nullable',
                'integer',
                'exists:addresses,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'phone' => [
                'required',
                'string',
                'max:30',
            ],
            'city' => [
                'required',
                'string',
                'max:255',
            ],
            'commune' => [
                'required',
                'string',
                'max:255',
            ],
            'quartier' => [
                'required',
                'string',
                'max:255',
            ],
            'address' => [
                'required',
                'string',
                'max:1000',
            ],
            'payment_method' => [
                'nullable',
                'in:cash_on_delivery,online',
            ],
            'payment_provider' => [
                'nullable',
                'in:wave_ci,orange_money_ci,mtn_money_ci',
            ],
            'items' => [
                'required',
                'array',
                'min:1',
            ],
            'items.*.id' => [
                'required',
                'integer',
                'exists:products,id',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
            'promotion_code' => [
                'nullable',
                'string',
                'max:50',
            ],
        ]);

        if (! empty($validated['address_id'])) {
            $address = Address::query()
                ->where('id', $validated['address_id'])
                ->where('user_id', auth()->id())
                ->first();

            if (! $address) {
                throw ValidationException::withMessages([
                    'address_id' => 'Cette adresse ne vous appartient pas.',
                ]);
            }
        }

        $paymentMethod = $validated['payment_method'] ?? 'cash_on_delivery';
        $paymentProvider = $validated['payment_provider'] ?? null;

        if (
            $paymentMethod === 'online'
            && empty($paymentProvider)
        ) {
            throw ValidationException::withMessages([
                'payment_provider' => 'Veuillez choisir Wave, Orange Money ou MTN Money.',
            ]);
        }

        if (
            $paymentProvider !== null
            && ! in_array($paymentProvider, self::SUPPORTED_PAYMENT_PROVIDERS, true)
        ) {
            throw ValidationException::withMessages([
                'payment_provider' => 'Veuillez choisir Wave, Orange Money ou MTN Money.',
            ]);
        }

        $order = null;

        try {
            $order = DB::transaction(function () use ($validated, $paymentMethod, $paymentProvider) {
                $subtotal = 0;
                $products = [];

                foreach ($validated['items'] as $item) {
                    $product = Product::query()
                        ->where('id', $item['id'])
                        ->where('status', 'active')
                        ->lockForUpdate()
                        ->first();

                    if (! $product) {
                        return $this->validationError(
                            'items',
                            'Un des produits sélectionnés n\'est plus disponible.'
                        );
                    }

                    if ($product->stock < $item['quantity']) {
                        return $this->validationError(
                            'items',
                            "Le stock disponible pour {$product->name} est insuffisant."
                        );
                    }

                    $lineTotal = (float) $product->price * $item['quantity'];
                    $subtotal += $lineTotal;

                    $products[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'unit_price' => (float) $product->price,
                        'total' => $lineTotal,
                    ];
                }

                $subtotal = round($subtotal, 2);
                $deliveryFee = 2000;
                $promotion = null;
                $discountAmount = 0;

                if (! empty($validated['promotion_code'])) {
                    $promotionCode = strtoupper(trim($validated['promotion_code']));

                    $promotion = Promotion::query()
                        ->where('code', $promotionCode)
                        ->lockForUpdate()
                        ->first();

                    if (! $promotion) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Code promo invalide.',
                        ]);
                    }

                    if (! $promotion->is_active) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Cette promotion est désactivée.',
                        ]);
                    }

                    $now = now();

                    if ($promotion->starts_at && $now->lt($promotion->starts_at)) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Cette promotion n\'est pas encore disponible.',
                        ]);
                    }

                    if ($promotion->ends_at && $now->gt($promotion->ends_at)) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Cette promotion a expiré.',
                        ]);
                    }

                    if ($promotion->usage_limit !== null && $promotion->usage_count >= $promotion->usage_limit) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Cette promotion a atteint sa limite d\'utilisation.',
                        ]);
                    }

                    if ($promotion->min_order_amount !== null && $subtotal < (float) $promotion->min_order_amount) {
                        throw ValidationException::withMessages([
                            'promotion_code' => 'Le montant minimum pour cette promotion est de '.number_format((float) $promotion->min_order_amount, 0, ',', ' ').' FCFA.',
                        ]);
                    }

                    if ($promotion->type === 'percentage') {
                        $discountAmount = $subtotal * ((float) $promotion->value / 100);

                        if ($promotion->max_discount !== null && $discountAmount > (float) $promotion->max_discount) {
                            $discountAmount = (float) $promotion->max_discount;
                        }
                    } else {
                        $discountAmount = (float) $promotion->value;
                    }

                    $discountAmount = min($discountAmount, $subtotal);
                    $discountAmount = round($discountAmount, 2);
                }

                $total = round($subtotal - $discountAmount + $deliveryFee, 2);

                $order = Order::create([
                    'user_id' => auth()->id(),
                    'promotion_id' => $promotion?->id,
                    'status' => 'pending',
                    'subtotal' => $subtotal,
                    'discount_amount' => $discountAmount,
                    'delivery_fee' => $deliveryFee,
                    'total' => $total,
                    'payment_method' => $paymentMethod,
                    'payment_provider' => $paymentMethod === 'online' ? $paymentProvider : null,
                    'payment_status' => 'pending',
                    'delivery_name' => $validated['name'],
                    'delivery_phone' => $validated['phone'],
                    'delivery_city' => $validated['city'],
                    'delivery_commune' => $validated['commune'],
                    'delivery_quartier' => $validated['quartier'],
                    'delivery_address' => $validated['address'],
                ]);

                foreach ($products as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product']->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total' => $item['total'],
                    ]);

                    $item['product']->decrement('stock', $item['quantity']);
                }

                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => 'pending',
                    'changed_by' => auth()->id(),
                    'comment' => 'Commande créée.',
                ]);

                if ($promotion) {
                    $promotion->increment('usage_count');
                }

                return $order;
            });

            if ($order instanceof JsonResponse) {
                return $order;
            }

            if ($paymentMethod === 'online') {
                $paymentDetails = app(GeniusPayService::class)->createPayment($order);

                Payment::create([
                    'order_id' => $order->id,
                    'transaction_id' => $paymentDetails['reference'],
                    'amount' => (int) $paymentDetails['amount'],
                    'currency' => $paymentDetails['currency'] ?? 'XOF',
                    'status' => $paymentDetails['status'] ?? 'pending',
                    'payment_url' => $paymentDetails['payment_url'] ?? $paymentDetails['checkout_url'] ?? null,
                ]);

                return response('', 409)
                    ->header('X-Inertia-Location', $paymentDetails['payment_url'] ?? $paymentDetails['checkout_url']);
            }

            return redirect()->route('orders.confirmation', $order);
        } catch (\Throwable $exception) {
            if ($order instanceof Order) {
                $this->cancelUnpaidOrder($order);
            }

            return redirect()->route('checkout')->withErrors([
                'payment' => 'Le paiement n’a pas été effectué.',
            ]);
        }
    }

    private function cancelUnpaidOrder(Order $order): void
    {
        $order->load('items');

        foreach ($order->items as $item) {
            $product = Product::withTrashed()
                ->lockForUpdate()
                ->find($item->product_id);

            if ($product) {
                $product->increment('stock', (int) $item->quantity);
            }
        }

        $order->update([
            'status' => 'cancelled',
            'payment_status' => 'failed',
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'cancelled',
            'changed_by' => auth()->id(),
            'comment' => 'Paiement annulé lors de l\'initialisation du paiement.',
        ]);
    }
}
