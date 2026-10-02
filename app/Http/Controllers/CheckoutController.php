<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

    public function store(Request $request)
    {
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
        ]);

        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Adresse enregistrée
        |--------------------------------------------------------------------------
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

        return DB::transaction(function () use ($validated, $user) {

            /*
            |--------------------------------------------------------------------------
            | Récupération des produits
            |--------------------------------------------------------------------------
            */

            $productIds = collect($validated['items'])
                ->pluck('id')
                ->all();

            $products = Product::whereIn('id', $productIds)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            /*
            |--------------------------------------------------------------------------
            | Vérification des produits
            |--------------------------------------------------------------------------
            */

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
                    (float) $product->price * $item['quantity'];
            }

            /*
            |--------------------------------------------------------------------------
            | Frais de livraison
            |--------------------------------------------------------------------------
            */

            $deliveryFee = 2000;

            $total = $subtotal + $deliveryFee;

            /*
            |--------------------------------------------------------------------------
            | Création de la commande
            |--------------------------------------------------------------------------
            */

            $order = Order::create([
                'user_id' => $user->id,

                'status' => 'pending',

                'subtotal' => $subtotal,

                'delivery_fee' => $deliveryFee,

                'total' => $total,

                'payment_method' => 'cash_on_delivery',

                'payment_status' => 'pending',

                'delivery_name' => $validated['name'],

                'delivery_phone' => $validated['phone'],

                'delivery_city' => $validated['city'],

                'delivery_commune' => $validated['commune'],

                'delivery_quartier' => $validated['quartier'],

                'delivery_address' => $validated['address'],
            ]);

            /*
            |--------------------------------------------------------------------------
            | Historique initial
            |--------------------------------------------------------------------------
            */

            OrderStatusHistory::create([
                'order_id' => $order->id,

                'status' => 'pending',

                'changed_by' => $user->id,

                'comment' => 'Commande créée.',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Création des lignes de commande
            |--------------------------------------------------------------------------
            */

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['id']);

                $lineTotal =
                    (float) $product->price * $item['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,

                    'quantity' => $item['quantity'],

                    'unit_price' => $product->price,

                    'total' => $lineTotal,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Diminution du stock
                |--------------------------------------------------------------------------
                */

                $product->decrement(
                    'stock',
                    $item['quantity']
                );
            }

            return redirect()
                ->route(
                    'orders.confirmation',
                    $order
                );
        });
    }

    public function confirmation(Order $order)
    {
        abort_unless(
            $order->user_id === auth()->id(),
            404
        );

        $order->load([
            'items.product',
        ]);

        return Inertia::render(
            'Orders/Confirmation',
            [
                'order' => $order,
            ]
        );
    }
}
