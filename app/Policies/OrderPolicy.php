<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Un utilisateur peut consulter une commande
     * si :
     * - il est administrateur ;
     * - il est le propriétaire de la commande ;
     * - il est le livreur affecté à cette commande.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'client') {
            return $order->user_id === $user->id;
        }

        if ($user->role === 'livreur') {
            return $order->delivery?->driver_id === $user->id;
        }

        return false;
    }

    /**
     * Seul un administrateur peut modifier
     * le statut général d'une commande.
     */
    public function updateStatus(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Seul un administrateur peut affecter
     * un livreur à une commande.
     */
    public function assignDriver(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Un client peut annuler uniquement
     * sa propre commande lorsqu'elle est encore pending.
     */
    public function cancel(User $user, Order $order): bool
    {
        return $user->role === 'client'
            && $order->user_id === $user->id
            && $order->status === 'pending';
    }
}
