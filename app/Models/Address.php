<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'city',
        'commune',
        'quartier',
        'address',
        'is_default',
    ];
}
