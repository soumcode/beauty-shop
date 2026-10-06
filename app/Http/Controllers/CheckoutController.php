<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Product;
use App\Services\GeniusPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use RuntimeException;

class CheckoutController extends Controller
{
    public function create()
    {
        $user = auth()->user();

        $addresses = $user->addresses()
            ->orderByDesc('is_default')
            ->latest()
            ->get();

        return Inertia::render('Checkout', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'addresses' => $addresses,
        ]);
    }

    public function store(
        Request $request,
        GeniusPayService $geniusPay
    ) {
        $validated = $request->validate([
            'address_id' => [
                'nullable',
                'integer',
                'exists:addresses,id',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
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
                'required',
                'in:cash_on_delivery,online',
            ],
        ]);

        $user = auth()->user();

        /*
         * Si une adresse enregistrée est sélectionnée,
         * on récupère ses vraies informations depuis la
         * base de données.
         */
        if ($validated['address_id'] ?? null) {
            $savedAddress = $user->addresses()
                ->findOrFail($validated['address_id']);

            $validated['name'] = $savedAddress->name;
            $validated['phone'] = $savedAddress->phone;
            $validated['city'] = $savedAddress->city;
            $validated['commune'] = $savedAddress->commune;
            $validated['quartier'] = $savedAddress->quartier;
            $validated['address'] = $savedAddress->address;
        }

        /*
         * On crée d'abord la commande et ses lignes
         * dans une transaction locale.
         */
        $order = DB::transaction(function () use (
            $validated,
            $user
        ) {
            $productIds = collect($validated['items'])
                ->pluck('id')
                ->all();

            $products = Product::whereIn('id', $productIds)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== count($productIds)) {
                abort(
                    422,
                    'Un ou plusieurs produits ne sont plus disponibles.'
                );
            }

            $subtotal = 0;

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['id']);

                if ($item['quantity'] > $product->stock) {
                    abort(
                        422,
                        "Le stock disponible pour {$product->name} est insuffisant."
                    );
                }

                $subtotal +=
                    (float) $product->price *
                    $item['quantity'];
            }

            $deliveryFee = 2000;

            $total = $subtotal + $deliveryFee;

            $order = Order::create([
                'user_id' => $user->id,

                'status' => 'pending',

                'subtotal' => $subtotal,

                'delivery_fee' => $deliveryFee,

                'total' => $total,

                'payment_method' => $validated['payment_method'],

                'payment_status' => 'pending',

                'delivery_name' => $validated['name'],

                'delivery_phone' => $validated['phone'],

                'delivery_city' => $validated['city'],

                'delivery_commune' => $validated['commune'],

                'delivery_quartier' => $validated['quartier'],

                'delivery_address' => $validated['address'],
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,

                'status' => 'pending',

                'changed_by' => $user->id,

                'comment' => 'Commande créée.',
            ]);

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['id']);

                $lineTotal =
                    (float) $product->price *
                    $item['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,

                    'quantity' => $item['quantity'],

                    'unit_price' => $product->price,

                    'total' => $lineTotal,
                ]);

                $product->decrement(
                    'stock',
                    $item['quantity']
                );
            }

            return $order;
        });

        /*
         * Paiement à la livraison :
         * on garde le fonctionnement normal.
         */
        if ($validated['payment_method'] === 'cash_on_delivery') {
            return redirect()->route(
                'orders.confirmation',
                $order
            );
        }

        /*
         * Paiement en ligne :
         * on crée le paiement GeniusPay après
         * la création de la commande.
         */
        try {
            $geniusPayment =
                $geniusPay->createPayment($order);

            Payment::create([
                'order_id' => $order->id,

                'transaction_id' => $geniusPayment['reference'],

                'amount' => (int) $order->total,

                'currency' => 'XOF',

                'status' => 'pending',

                'payment_url' => $geniusPayment['checkout_url'],
            ]);

            return redirect(
                $geniusPayment['checkout_url']
            );
        } catch (RuntimeException $exception) {
            /*
             * Si GeniusPay ne répond pas correctement,
             * on annule la commande et on restaure
             * le stock.
             */
            DB::transaction(function () use ($order) {
                $order->load('items');

                foreach ($order->items as $item) {
                    $product = Product::withTrashed()
                        ->lockForUpdate()
                        ->find($item->product_id);

                    if ($product) {
                        $product->increment(
                            'stock',
                            $item->quantity
                        );
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

                    'comment' => 'Commande annulée : impossible d’initialiser le paiement en ligne.',
                ]);
            });

            return back()->withErrors([
                'payment' => 'Le paiement en ligne n’a pas pu être initialisé. Veuillez réessayer.',
            ]);
        }
    }

    public function confirmation(Order $order)
    {
        abort_unless(
            $order->user_id === auth()->id(),
            404
        );

        $order->load([
            'items.product',
            'payment',
        ]);

        return Inertia::render(
            'Orders/Confirmation',
            [
                'order' => $order,
            ]
        );
    }
}
