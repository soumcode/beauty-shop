<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $type = $request->input('type');
        $status = $request->input('status');

        $promotions = Promotion::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->when($type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($status !== null && $status !== '', function ($query) use ($status) {
                $query->where(
                    'is_active',
                    $status === 'active'
                );
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Promotions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                'unique:promotions,code',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'type' => [
                'required',
                Rule::in([
                    'percentage',
                    'fixed',
                ]),
            ],
            'value' => [
                'required',
                'numeric',
                'min:0.01',
            ],
            'min_order_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'max_discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'usage_limit' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'starts_at' => [
                'nullable',
                'date',
            ],
            'ends_at' => [
                'nullable',
                'date',
                'after_or_equal:starts_at',
            ],
            'is_active' => [
                'boolean',
            ],
        ]);

        if (
            $validated['type'] === 'percentage'
            && $validated['value'] > 100
        ) {
            return back()
                ->withInput()
                ->withErrors([
                    'value' => 'Une réduction en pourcentage ne peut pas dépasser 100 %.',
                ]);
        }

        $validated['code'] = strtoupper(
            trim($validated['code'])
        );

        $validated['is_active'] =
            $request->boolean('is_active');

        Promotion::create($validated);

        return redirect()
            ->route('admin.promotions.index')
            ->with(
                'success',
                'La promotion a été créée avec succès.'
            );
    }

    public function edit(Promotion $promotion)
    {
        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotion,
        ]);
    }

    public function update(
        Request $request,
        Promotion $promotion
    ) {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique('promotions', 'code')
                    ->ignore($promotion->id),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'type' => [
                'required',
                Rule::in([
                    'percentage',
                    'fixed',
                ]),
            ],
            'value' => [
                'required',
                'numeric',
                'min:0.01',
            ],
            'min_order_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'max_discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'usage_limit' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'starts_at' => [
                'nullable',
                'date',
            ],
            'ends_at' => [
                'nullable',
                'date',
                'after_or_equal:starts_at',
            ],
            'is_active' => [
                'boolean',
            ],
        ]);

        if (
            $validated['type'] === 'percentage'
            && $validated['value'] > 100
        ) {
            return back()
                ->withInput()
                ->withErrors([
                    'value' => 'Une réduction en pourcentage ne peut pas dépasser 100 %.',
                ]);
        }

        $validated['code'] = strtoupper(
            trim($validated['code'])
        );

        $validated['is_active'] =
            $request->boolean('is_active');

        $promotion->update($validated);

        return redirect()
            ->route('admin.promotions.index')
            ->with(
                'success',
                'La promotion a été modifiée avec succès.'
            );
    }

    public function destroy(Promotion $promotion)
    {
        if ($promotion->usage_count > 0) {
            return back()->with(
                'error',
                'Cette promotion a déjà été utilisée. Désactivez-la plutôt que de la supprimer.'
            );
        }

        $promotion->delete();

        return back()->with(
            'success',
            'La promotion a été supprimée avec succès.'
        );
    }

    public function toggle(Promotion $promotion)
    {
        $promotion->update([
            'is_active' => ! $promotion->is_active,
        ]);

        return back()->with(
            'success',
            $promotion->is_active
                ? 'La promotion a été activée.'
                : 'La promotion a été désactivée.'
        );
    }
}
