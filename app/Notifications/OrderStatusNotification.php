<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification
{
    public function __construct(
        public Order $order
    ) {}

    public function via(
        object $notifiable
    ): array {
        return [
            'database',
        ];
    }

    public function toDatabase(
        object $notifiable
    ): array {
        $statusLabels = [
            'pending' => 'En attente',
            'confirmed' => 'Confirmée',
            'preparing' => 'En préparation',
            'ready' => 'Prête',
            'assigned' => 'Livreur affecté',
            'out_for_delivery' => 'En livraison',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
        ];

        $statusLabel =
            $statusLabels[$this->order->status]
            ?? $this->order->status;

        return [
            'order_id' => $this->order->id,

            'status' => $this->order->status,

            'title' => 'Mise à jour de votre commande',

            'message' => "Votre commande #{$this->order->id} est maintenant : {$statusLabel}.",
        ];
    }
}
