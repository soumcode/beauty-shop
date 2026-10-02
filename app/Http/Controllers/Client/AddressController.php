<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = auth()->user()
            ->addresses()
            ->latest()
            ->get();

        return Inertia::render('Client/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Client/Addresses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
            ],

            'city' => [
                'required',
                'string',
                'max:255',
            ],

            'commune' => [
                'required',
                'string',
                'max:255',
            ],

            'quartier' => [
                'required',
                'string',
                'max:255',
            ],

            'address' => [
                'required',
                'string',
                'max:1000',
            ],
        ]);

        $user = auth()->user();

        $isFirstAddress = ! $user->addresses()->exists();

        $user->addresses()->create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'commune' => $validated['commune'],
            'quartier' => $validated['quartier'],
            'address' => $validated['address'],
            'is_default' => $isFirstAddress,
        ]);

        return redirect()
            ->route('client.addresses.index')
            ->with('success', 'Adresse ajoutée avec succès.');
    }

    public function edit(Address $address)
    {
        $address = auth()->user()
            ->addresses()
            ->findOrFail($address->id);

        return Inertia::render('Client/Addresses/Edit', [
            'address' => $address,
        ]);
    }

    public function update(Request $request, Address $address)
    {
        $address = auth()->user()
            ->addresses()
            ->findOrFail($address->id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
            ],

            'city' => [
                'required',
                'string',
                'max:255',
            ],

            'commune' => [
                'required',
                'string',
                'max:255',
            ],

            'quartier' => [
                'required',
                'string',
                'max:255',
            ],

            'address' => [
                'required',
                'string',
                'max:1000',
            ],
        ]);

        $address->update($validated);

        return redirect()
            ->route('client.addresses.index')
            ->with('success', 'Adresse modifiée avec succès.');
    }

    public function destroy(Address $address)
    {
        $user = auth()->user();

        $address = $user->addresses()
            ->findOrFail($address->id);

        DB::transaction(function () use ($address, $user) {
            $wasDefault = $address->is_default;

            $address->delete();

            if ($wasDefault) {
                $nextAddress = $user->addresses()
                    ->oldest()
                    ->first();

                if ($nextAddress) {
                    $nextAddress->update([
                        'is_default' => true,
                    ]);
                }
            }
        });

        return back()->with(
            'success',
            'Adresse supprimée avec succès.'
        );
    }

    public function setDefault(Address $address)
    {
        $user = auth()->user();

        $address = $user->addresses()
            ->findOrFail($address->id);

        DB::transaction(function () use ($user, $address) {
            $user->addresses()->update([
                'is_default' => false,
            ]);

            $address->update([
                'is_default' => true,
            ]);
        });

        return back()->with(
            'success',
            'Adresse par défaut mise à jour.'
        );
    }
}
