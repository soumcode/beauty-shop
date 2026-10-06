<?php

namespace App\Http\Controllers;

use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GeniusPayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        
        $signature = $request->header(
            'X-Webhook-Signature'
        );

        $timestamp = $request->header(
            'X-Webhook-Timestamp'
        );

        $eventHeader = $request->header(
            'X-Webhook-Event'
        );

        
        if (! $signature || ! $timestamp) {
            return response()->json([
                'message' => 'Signature webhook manquante.',
            ], 401);
        }

        
        if (
            ! is_numeric($timestamp) ||
            abs(time() - (int) $timestamp) > 300
        ) {
            return response()->json([
                'message' => 'Webhook expiré.',
            ], 400);
        }

        
        $rawPayload = $request->getContent();

        
        $signedData =
            $timestamp.'.'.$rawPayload;

        $expectedSignature = hash_hmac(
            'sha256',
            $signedData,
            config('services.geniuspay.webhook_secret')
        );

        
        if (
            ! hash_equals(
                $expectedSignature,
                $signature
            )
        ) {
            return response()->json([
                'message' => 'Signature webhook invalide.',
            ], 401);
        }

        
        $payload = json_decode(
            $rawPayload,
            true
        );

        if (! is_array($payload)) {
            return response()->json([
                'message' => 'Payload invalide.',
            ], 400);
        }

        
        $event = $payload['event'] ?? $eventHeader;

        if (! $event) {
            return response()->json([
                'message' => 'Événement manquant.',
            ], 400);
        }

        
        $supportedEvents = [
            'payment.success',
            'payment.failed',
            'payment.cancelled',
            'payment.expired',
        ];

        if (! in_array($event, $supportedEvents, true)) {
            return response()->json([
                'success' => true,
                'message' => 'Événement ignoré.',
            ]);
        }

        
        $paymentData = $payload['data'] ?? [];

        $reference =
            $paymentData['reference'] ?? null;

        $orderId =
            $paymentData['metadata']['order_id']
            ?? null;

        if (! $reference || ! $orderId) {
            return response()->json([
                'message' => 'Référence ou commande manquante.',
            ], 400);
        }

        
        $payment = Payment::where(
            'transaction_id',
            $reference
        )->first();

        if (! $payment) {
            return response()->json([
                'message' => 'Paiement introuvable.',
            ], 404);
        }

        
        if ((string) $payment->order_id !== (string) $orderId) {
            return response()->json([
                'message' => 'La commande ne correspond pas au paiement.',
            ], 400);
        }

        
        if (
            in_array(
                $payment->status,
                ['completed', 'failed'],
                true
            )
        ) {
            return response()->json([
                'success' => true,
                'message' => 'Paiement déjà traité.',
            ]);
        }

        
        DB::transaction(function () use (
            $payment,
            $event
        ) {
            $order = $payment->order()
                ->lockForUpdate()
                ->firstOrFail();

            switch ($event) {
                case 'payment.success':
                    $this->handleSuccess(
                        $payment,
                        $order
                    );

                    break;

                case 'payment.failed':
                case 'payment.cancelled':
                case 'payment.expired':
                    $this->handleFailure(
                        $payment,
                        $order,
                        $event
                    );

                    break;
            }
        });

        
        return response()->json([
            'success' => true,
        ]);
    }

    private function handleSuccess(
        Payment $payment,
        $order
    ): void {
        $payment->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        $order->update([
            'payment_status' => 'paid',
        ]);
    }

    private function handleFailure(
        Payment $payment,
        $order,
        string $event
    ): void {
        
        $order->load('items');

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

        $payment->update([
            'status' => 'failed',
        ]);

        $order->update([
            'status' => 'cancelled',
            'payment_status' => 'failed',
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,

            'status' => 'cancelled',

            'changed_by' => null,

            'comment' => match ($event) {
                'payment.cancelled' => 'Paiement annulé par le client.',

                'payment.expired' => 'Paiement expiré.',

                default => 'Paiement échoué.',
            },
        ]);
    }
}
