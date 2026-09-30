<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'subtotal',
        'delivery_fee',
        'total',
        'payment_method',
        'payment_status',
        'delivery_name',
        'delivery_phone',
        'delivery_city',
        'delivery_commune',
        'delivery_quartier',
        'delivery_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
