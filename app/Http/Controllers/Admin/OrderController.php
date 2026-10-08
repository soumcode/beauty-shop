<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $zone = $request->input('zone');

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
            ->when($zone, function ($query, $zone) {
                $query->where(function ($query) use ($zone) {
                    $query->where('delivery_city', 'like', "%{$zone}%")
                        ->orWhere('delivery_commune', 'like', "%{$zone}%")
                        ->orWhere('delivery_quartier', 'like', "%{$zone}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'zone' => $zone,
            ],
            'statusOptions' => $this->statusOptions(),
            'availableDrivers' => $this->availableDrivers(),
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

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'statusOptions' => $this->statusOptions(),
            'nextStatusOptions' => $this->allowedTransitions(
                $order->status
            ),
            'availableDrivers' => $this->availableDrivers(),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $this->authorize('updateStatus', $order);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(array_keys($this->statusOptions())),
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

        $this->assignOrdersToDriver(
            [$order->id],
            $validated['driver_id'],
            'driver_id'
        );

        return back()->with(
            'success',
            'Livreur affecté à la commande.'
        );
    }

    public function assignDriverBatch(Request $request)
    {
        $validated = $request->validate([
            'driver_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],
            'order_ids' => [
                'required',
                'array',
                'min:2',
            ],
            'order_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:orders,id',
            ],
        ]);

        $this->assignOrdersToDriver(
            $validated['order_ids'],
            $validated['driver_id']
        );

        return back()->with(
            'success',
            'Commandes affectées au livreur.'
        );
    }

    /**
     * @param  array<int, int>  $orderIds
     */
    private function assignOrdersToDriver(
        array $orderIds,
        int $driverId,
        string $orderErrorField = 'order_ids'
    ): void {
        DB::transaction(function () use ($orderIds, $driverId, $orderErrorField) {
            $driver = User::query()
                ->lockForUpdate()
                ->findOrFail($driverId);

            if ($driver->role !== 'livreur') {
                throw ValidationException::withMessages([
                    'driver_id' => 'Veuillez sélectionner un livreur valide.',
                ]);
            }

            $orders = Order::query()
                ->whereKey($orderIds)
                ->lockForUpdate()
                ->get();

            if ($orders->count() !== count($orderIds)) {
                abort(404);
            }

            foreach ($orders as $order) {
                $this->authorize('assignDriver', $order);

                if ($order->status !== 'ready') {
                    $message = count($orderIds) === 1
                        ? 'Cette commande doit être prête avant d’être affectée à un livreur.'
                        : 'Toutes les commandes sélectionnées doivent être prêtes avant leur affectation.';

                    throw ValidationException::withMessages([
                        $orderErrorField => $message,
                    ]);
                }

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
            }
        });
    }

    /**
     * @return Collection<int, User>
     */
    private function availableDrivers(): Collection
    {
        return User::query()
            ->where('role', 'livreur')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'phone',
            ]);
    }

    private function statusOptions(): array
    {
        return [
            'pending' => 'En attente',
            'confirmed' => 'Confirmée',
            'preparing' => 'En préparation',
            'ready' => 'Prête',
            'assigned' => 'Affectée à un livreur',
            'out_for_delivery' => 'En cours de livraison',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
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
