<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Statuts permettant au client d'annuler sa commande.
     */
    private const CANCELLABLE_STATUSES = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
    ];

    public function index(Request $request)
    {
        $orders = Order::where(
            'user_id',
            auth()->id()
        )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render(
            'Client/Orders/Index',
            [
                'orders' => $orders,
            ]
        );
    }

    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'delivery.driver',
            'statusHistories.changedBy',
        ]);

        $this->authorize(
            'view',
            $order
        );

        return Inertia::render(
            'Client/Orders/Show',
            [
                'order' => $order,
            ]
        );
    }

    public function cancel(Order $order)
    {
        $this->authorize(
            'cancel',
            $order
        );

        DB::transaction(function () use ($order) {

            /*
             * On verrouille la commande pendant toute
             * l'opération afin d'éviter qu'elle soit
             * annulée deux fois simultanément.
             */
            $lockedOrder = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
             * Protection contre une double restitution
             * du stock.
             */
            if ($lockedOrder->status === 'cancelled') {
                return;
            }

            /*
             * Sécurité supplémentaire :
             * le client ne peut annuler que les commandes
             * qui sont encore dans une phase annulable.
             */
            if (
                ! in_array(
                    $lockedOrder->status,
                    self::CANCELLABLE_STATUSES,
                    true
                )
            ) {
                throw ValidationException::withMessages([
                    'order' => 'Cette commande ne peut plus être annulée.',
                ]);
            }

            $lockedOrder->load('items');

            /*
             * Restitution du stock.
             */
            foreach ($lockedOrder->items as $item) {

                $product = Product::withTrashed()
                    ->lockForUpdate()
                    ->find($item->product_id);

                if ($product) {
                    $product->increment(
                        'stock',
                        (int) $item->quantity
                    );
                }
            }

            /*
             * Passage de la commande à cancelled.
             */
            $lockedOrder->update([
                'status' => 'cancelled',
            ]);

            /*
             * Historique du changement.
             */
            OrderStatusHistory::create([
                'order_id' => $lockedOrder->id,
                'status' => 'cancelled',
                'changed_by' => auth()->id(),
                'comment' => 'Commande annulée par le client.',
            ]);
        });

        return back()->with(
            'success',
            'Votre commande a été annulée.'
        );
    }
}
