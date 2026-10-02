<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Client/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'delivery.driver',
            'statusHistories.changedBy',
        ]);

        $this->authorize('view', $order);

        return Inertia::render('Client/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function cancel(Order $order)
    {
        $order->load('items');

        $this->authorize('cancel', $order);

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::withTrashed()
                    ->lockForUpdate()
                    ->find($item->product_id);

                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'status' => 'cancelled',
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'cancelled',
                'changed_by' => auth()->id(),
                'comment' => 'Commande annulée par le client.',
            ]);
        });

        return back()->with(
            'success',
            'Votre commande a été annulée.'
        );
    }
}
