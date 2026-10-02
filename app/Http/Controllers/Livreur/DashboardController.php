<?php

namespace App\Http\Controllers\Livreur;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $driver = auth()->user();

        $statistics = [
            'totalDeliveries' => Delivery::where(
                'driver_id',
                $driver->id
            )->count(),

            'assignedDeliveries' => Delivery::where(
                'driver_id',
                $driver->id
            )
                ->where('status', 'assigned')
                ->count(),

            'inProgressDeliveries' => Delivery::where(
                'driver_id',
                $driver->id
            )
                ->whereIn('status', [
                    'picked_up',
                    'out_for_delivery',
                ])
                ->count(),

            'deliveredDeliveries' => Delivery::where(
                'driver_id',
                $driver->id
            )
                ->where('status', 'delivered')
                ->count(),

            'failedDeliveries' => Delivery::where(
                'driver_id',
                $driver->id
            )
                ->where('status', 'failed')
                ->count(),
        ];

        $recentDeliveries = Delivery::where(
            'driver_id',
            $driver->id
        )
            ->with('order.user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Livreur/Dashboard', [
            'user' => $driver,
            'statistics' => $statistics,
            'recentDeliveries' => $recentDeliveries,
        ]);
    }
}
