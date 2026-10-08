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
        'payment_provider',
        'payment_status',

        'delivery_name',
        'delivery_phone',
        'delivery_city',
        'delivery_commune',
        'delivery_quartier',
        'delivery_address',
        'promotion_id',
        'discount_amount',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function items()
    {
        return $this->hasMany(
            OrderItem::class
        );
    }

    public function delivery()
    {
        return $this->hasOne(
            Delivery::class
        );
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class)
            ->latest();
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }
}
