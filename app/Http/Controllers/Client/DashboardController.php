<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $statistics = [
            'orders' => Order::where('user_id', $user->id)->count(),

            'activeOrders' => Order::where('user_id', $user->id)
                ->whereIn('status', [
                    'pending',
                    'confirmed',
                    'preparing',
                    'ready',
                    'assigned',
                    'out_for_delivery',
                ])
                ->count(),

            'deliveredOrders' => Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->count(),

            'cancelledOrders' => Order::where('user_id', $user->id)
                ->where('status', 'cancelled')
                ->count(),
        ];

        $recentOrders = Order::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Client/Dashboard', [
            'user' => $user,
            'statistics' => $statistics,
            'recentOrders' => $recentOrders,
        ]);
    }
}
