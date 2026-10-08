<?php

namespace App\Policies;

use App\Models\Delivery;
use App\Models\User;

class DeliveryPolicy
{
    public function view(User $user, Delivery $delivery): bool
    {
        $role = $user->role ?? 'client';

        if ($role === 'admin') {
            return true;
        }

        return $role === 'livreur'
            && $delivery->driver_id === $user->id;
    }

    public function updateStatus(User $user, Delivery $delivery): bool
    {
        $role = $user->role ?? 'client';

        return $role === 'livreur'
            && $delivery->driver_id === $user->id;
    }
}
