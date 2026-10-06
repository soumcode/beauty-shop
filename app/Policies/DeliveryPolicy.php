<?php

namespace App\Policies;

use App\Models\Delivery;
use App\Models\User;

class DeliveryPolicy
{
    
    public function view(User $user, Delivery $delivery): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'livreur'
            && $delivery->driver_id === $user->id;
    }

    
    public function updateStatus(User $user, Delivery $delivery): bool
    {
        return $user->role === 'livreur'
            && $delivery->driver_id === $user->id;
    }
}
