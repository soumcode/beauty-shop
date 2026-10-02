<?php

namespace App\Policies;

use App\Models\Delivery;
use App\Models\User;

class DeliveryPolicy
{
    /**
     * Un administrateur peut voir toutes les livraisons.
     *
     * Un livreur peut voir uniquement
     * les livraisons qui lui sont affectées.
     */
    public function view(User $user, Delivery $delivery): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'livreur'
            && $delivery->driver_id === $user->id;
    }

    /**
     * Seul le livreur affecté peut modifier
     * le statut de sa livraison.
     */
    public function updateStatus(User $user, Delivery $delivery): bool
    {
        return $user->role === 'livreur'
            && $delivery->driver_id === $user->id;
    }
}
