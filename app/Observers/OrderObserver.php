<?php

namespace App\Observers;

use App\Models\Order;
use App\Notifications\OrderStatusNotification;

class OrderObserver
{
    public function updated(Order $order): void
    {
        /*
        |--------------------------------------------------------------------------
        | Vérifier si le statut de la commande a changé
        |--------------------------------------------------------------------------
        */

        if (! $order->wasChanged('status')) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Charger le client
        |--------------------------------------------------------------------------
        */

        $order->loadMissing('user');

        /*
        |--------------------------------------------------------------------------
        | Envoyer la notification
        |--------------------------------------------------------------------------
        */

        if ($order->user) {
            $order->user->notify(
                new OrderStatusNotification($order)
            );
        }
    }
}
