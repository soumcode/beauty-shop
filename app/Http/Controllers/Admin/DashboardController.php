<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $statistics = [
            'products' => Product::count(),

            'clients' => User::where('role', 'client')->count(),

            'orders' => Order::count(),

            'drivers' => User::where('role', 'livreur')->count(),

            'pendingOrders' => Order::where('status', 'pending')->count(),

            'preparingOrders' => Order::where('status', 'preparing')->count(),

            'outForDeliveryOrders' => Order::where(
                'status',
                'out_for_delivery'
            )->count(),

            'deliveredOrders' => Order::where(
                'status',
                'delivered'
            )->count(),
        ];

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'statistics' => $statistics,
            'recentOrders' => $recentOrders,
        ]);
    }
}
