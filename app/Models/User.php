<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function addresses()
    {
        return $this->hasMany(
            Address::class
        );
    }

    public function orders()
    {
        return $this->hasMany(
            Order::class
        );
    }

    public function deliveries()
    {
        return $this->hasMany(
            Delivery::class,
            'driver_id'
        );
    }

    public function orderStatusHistories()
    {
        return $this->hasMany(
            OrderStatusHistory::class,
            'changed_by'
        );
    }
}
