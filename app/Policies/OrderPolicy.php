<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    
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

    
    public function updateStatus(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }

    
    public function assignDriver(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }

    
    public function cancel(User $user, Order $order): bool
    {
        return $user->role === 'client'
            && $order->user_id === $user->id
            && $order->status === 'pending';
    }
}
