<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $orders = Order::with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('id', $search)
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load([
            'user',
            'items.product',
            'delivery.driver',
            'statusHistories.changedBy',
        ]);

        $drivers = User::where('role', 'livreur')
            ->whereDoesntHave('deliveries', function ($query) {
                $query->whereIn('status', [
                    'assigned',
                    'picked_up',
                    'out_for_delivery',
                ]);
            })
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'phone',
            ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'statusOptions' => $this->statusOptions(),
            'nextStatusOptions' => $this->allowedTransitions(
                $order->status
            ),
            'drivers' => $drivers,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $this->authorize('updateStatus', $order);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:'.implode(',', $this->statusOptions()),
            ],
        ]);

        $newStatus = $validated['status'];

        $allowedStatuses = $this->allowedTransitions(
            $order->status
        );

        if (! in_array($newStatus, $allowedStatuses, true)) {
            return back()->withErrors([
                'status' => 'Cette transition de statut n’est pas autorisée.',
            ]);
        }

        DB::transaction(function () use ($order, $newStatus) {
            if ($newStatus === 'cancelled') {
                foreach ($order->items as $item) {
                    $product = Product::withTrashed()
                        ->lockForUpdate()
                        ->find($item->product_id);

                    if ($product) {
                        $product->increment(
                            'stock',
                            $item->quantity
                        );
                    }
                }
            }

            $order->update([
                'status' => $newStatus,
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $newStatus,
                'changed_by' => auth()->id(),
                'comment' => $this->statusComment($newStatus),
            ]);
        });

        return back()->with(
            'success',
            'Statut de la commande mis à jour.'
        );
    }

    public function assignDriver(
        Request $request,
        Order $order
    ) {
        $this->authorize('assignDriver', $order);

        $validated = $request->validate([
            'driver_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],
        ]);

        if ($order->status !== 'ready') {
            return back()->withErrors([
                'driver_id' => 'Cette commande doit être prête avant d’être affectée à un livreur.',
            ]);
        }

        $driver = User::where('id', $validated['driver_id'])
            ->where('role', 'livreur')
            ->firstOrFail();

        $hasActiveDelivery = $driver->deliveries()
            ->whereIn('status', [
                'assigned',
                'picked_up',
                'out_for_delivery',
            ])
            ->exists();

        if ($hasActiveDelivery) {
            return back()->withErrors([
                'driver_id' => 'Ce livreur possède déjà une livraison en cours.',
            ]);
        }

        DB::transaction(function () use ($order, $driver) {
            $delivery = $order->delivery()->firstOrNew();

            $delivery->driver_id = $driver->id;
            $delivery->status = 'assigned';
            $delivery->assigned_at = now();
            $delivery->picked_up_at = null;
            $delivery->delivered_at = null;
            $delivery->notes = null;
            $delivery->save();

            $order->update([
                'status' => 'assigned',
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'assigned',
                'changed_by' => auth()->id(),
                'comment' => 'Livreur affecté à la commande.',
            ]);
        });

        return back()->with(
            'success',
            'Livreur affecté à la commande.'
        );
    }

    private function statusOptions(): array
    {
        return [
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'assigned',
            'out_for_delivery',
            'delivered',
            'cancelled',
        ];
    }

    private function allowedTransitions(string $status): array
    {
        return match ($status) {
            'pending' => [
                'confirmed',
                'cancelled',
            ],

            'confirmed' => [
                'preparing',
                'cancelled',
            ],

            'preparing' => [
                'ready',
                'cancelled',
            ],

            'ready' => [
                'cancelled',
            ],

            'assigned',
            'out_for_delivery',
            'delivered',
            'cancelled' => [],

            default => [],
        };
    }

    private function statusComment(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Commande confirmée.',

            'preparing' => 'Commande en préparation.',

            'ready' => 'Commande prête.',

            'cancelled' => 'Commande annulée.',

            default => 'Statut de la commande mis à jour.',
        };
    }
}
