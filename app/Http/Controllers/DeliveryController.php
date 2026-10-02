<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    /**
     * Liste des livraisons du livreur connecté.
     */
    public function index()
    {
        $deliveries = Delivery::with([
            'order.user',
        ])
            ->where(
                'driver_id',
                auth()->id()
            )
            ->latest()
            ->paginate(10);

        $statusOptions = [
            'assigned' => 'Livreur affecté',

            'picked_up' => 'Colis récupéré',

            'out_for_delivery' => 'En cours de livraison',

            'delivered' => 'Livrée',

            'failed' => 'Échec',
        ];

        return Inertia::render(
            'Livreur/Deliveries/Index',
            [
                'deliveries' => $deliveries,

                'statusOptions' => $statusOptions,
            ]
        );
    }

    /**
     * Détail d'une livraison.
     */
    public function show(
        Delivery $delivery
    ) {

        $this->authorize('view', $delivery);
        /*
         * Sécurité :
         * un livreur ne peut voir que ses livraisons.
         */
        abort_unless(
            $delivery->driver_id ===
            auth()->id(),
            403
        );

        $delivery->load([
            'driver',
            'order.user',
            'order.items.product',
        ]);

        $statusOptions = [
            'assigned' => 'Livreur affecté',

            'picked_up' => 'Colis récupéré',

            'out_for_delivery' => 'En cours de livraison',

            'delivered' => 'Livrée',

            'failed' => 'Échec',
        ];

        return Inertia::render(
            'Livreur/Deliveries/Show',
            [
                'delivery' => $delivery,

                'statusOptions' => $statusOptions,
            ]
        );
    }

    /**
     * Modifier l'état d'une livraison.
     */
    public function updateStatus(Request $request, Delivery $delivery)
    {
        $this->authorize('updateStatus', $delivery);
        abort_unless(
            $delivery->driver_id === auth()->id(),
            403
        );

        $allowedTransitions = [
            'assigned' => [
                'picked_up',
                'failed',
            ],

            'picked_up' => [
                'out_for_delivery',
                'failed',
            ],

            'out_for_delivery' => [
                'delivered',
                'failed',
            ],

            'delivered' => [],

            'failed' => [],
        ];

        $validated = $request->validate([
            'status' => [
                'required',
                'in:picked_up,out_for_delivery,delivered,failed',
                function (string $attribute, mixed $value, $fail) use ($delivery, $allowedTransitions) {
                    if (
                        ! in_array(
                            $value,
                            $allowedTransitions[$delivery->status] ?? [],
                            true
                        )
                    ) {
                        $fail('Cette transition de livraison n\'est pas autorisée.');
                    }
                },
            ],
        ]);

        $newDeliveryStatus = $validated['status'];

        DB::transaction(function () use (
            $delivery,
            $newDeliveryStatus
        ) {
            /*
            |--------------------------------------------------------------------------
            | Statut actuel de la commande
            |--------------------------------------------------------------------------
            */

            $order = $delivery->order;

            $oldOrderStatus = $order->status;

            /*
            |--------------------------------------------------------------------------
            | Mise à jour de la livraison
            |--------------------------------------------------------------------------
            */

            $delivery->status = $newDeliveryStatus;

            if ($newDeliveryStatus === 'picked_up') {
                $delivery->picked_up_at = now();
            }

            if ($newDeliveryStatus === 'out_for_delivery') {
                // Aucun timestamp supplémentaire pour le moment.
            }

            if ($newDeliveryStatus === 'delivered') {
                $delivery->delivered_at = now();
            }

            $delivery->save();

            /*
            |--------------------------------------------------------------------------
            | Mise à jour de la commande
            |--------------------------------------------------------------------------
            */

            $newOrderStatus = match ($newDeliveryStatus) {
                'picked_up' => 'assigned',
                'out_for_delivery' => 'out_for_delivery',
                'delivered' => 'delivered',
                'failed' => 'ready',
                default => $oldOrderStatus,
            };

            $order->update([
                'status' => $newOrderStatus,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Historique de la commande
            |--------------------------------------------------------------------------
            |
            | On enregistre uniquement si le statut de la commande
            | a réellement changé.
            |
            */

            if ($oldOrderStatus !== $newOrderStatus) {
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => $newOrderStatus,
                    'changed_by' => auth()->id(),
                    'comment' => $this->statusComment(
                        $newOrderStatus
                    ),
                ]);
            }
        });

        return back()->with(
            'success',
            'Statut de la livraison mis à jour.'
        );
    }

    private function statusComment(string $status): string
    {
        return match ($status) {
            'out_for_delivery' => 'Commande sortie pour la livraison.',

            'delivered' => 'Commande livrée au client.',

            'ready' => 'Livraison échouée. La commande est de nouveau prête.',

            default => 'Statut de la commande mis à jour.',
        };
    }
}
