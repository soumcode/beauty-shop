<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DriverController extends Controller
{
    
    public function index()
    {
        $drivers = User::where(
            'role',
            'livreur'
        )
            ->withCount([
                'deliveries as active_deliveries_count' => function ($query) {
                    $query->whereIn('status', [
                        'assigned',
                        'picked_up',
                        'out_for_delivery',
                    ]);
                },
            ])
            ->latest()
            ->get();

        return Inertia::render(
            'Admin/Drivers/Index',
            [
                'drivers' => $drivers,
            ]
        );
    }

    
    public function create()
    {
        return Inertia::render(
            'Admin/Drivers/Create'
        );
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        User::create([
            'name' => $validated['name'],

            'email' => $validated['email'],

            'phone' => $validated['phone'],

            'password' => Hash::make(
                $validated['password']
            ),

            
            'role' => 'livreur',
        ]);

        return redirect()
            ->route('admin.drivers.index')
            ->with(
                'success',
                'Livreur créé avec succès.'
            );
    }

    
    public function edit(User $driver)
    {
        abort_unless(
            $driver->role === 'livreur',
            404
        );

        return Inertia::render(
            'Admin/Drivers/Edit',
            [
                'driver' => $driver,
            ]
        );
    }

    
    public function update(
        Request $request,
        User $driver
    ) {
        abort_unless(
            $driver->role === 'livreur',
            404
        );

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique(
                    'users',
                    'email'
                )->ignore($driver->id),
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $driver->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if (
            ! empty(
                $validated['password']
            )
        ) {
            $driver->update([
                'password' => Hash::make(
                    $validated['password']
                ),
            ]);
        }

        return redirect()
            ->route('admin.drivers.index')
            ->with(
                'success',
                'Livreur modifié avec succès.'
            );
    }
}
