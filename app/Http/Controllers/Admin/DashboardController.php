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
            // Vue générale
            'products' => Product::count(),

            'clients' => User::where(
                'role',
                'client'
            )->count(),

            'orders' => Order::count(),

            'drivers' => User::where(
                'role',
                'livreur'
            )->count(),

            // Stock
            'totalUnitsInStock' => (int) Product::sum(
                'stock'
            ),

            'lowStockProducts' => Product::whereBetween(
                'stock',
                [1, 5]
            )->count(),

            'outOfStockProducts' => Product::where(
                'stock',
                0
            )->count(),

            // Commandes
            'pendingOrders' => Order::where(
                'status',
                'pending'
            )->count(),

            'confirmedOrders' => Order::where(
                'status',
                'confirmed'
            )->count(),

            'preparingOrders' => Order::where(
                'status',
                'preparing'
            )->count(),

            'readyOrders' => Order::where(
                'status',
                'ready'
            )->count(),

            'assignedOrders' => Order::where(
                'status',
                'assigned'
            )->count(),

            'outForDeliveryOrders' => Order::where(
                'status',
                'out_for_delivery'
            )->count(),

            'deliveredOrders' => Order::where(
                'status',
                'delivered'
            )->count(),

            'cancelledOrders' => Order::where(
                'status',
                'cancelled'
            )->count(),

            // Montant des commandes réellement livrées
            'deliveredAmount' => (float) Order::where(
                'status',
                'delivered'
            )->sum('total'),
        ];

        $recentOrders = Order::with([
            'user',
        ])
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render(
            'Admin/Dashboard',
            [
                'statistics' => $statistics,
                'recentOrders' => $recentOrders,
            ]
        );
    }
}
