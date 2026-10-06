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
        /*
         * 1. Récupérer les informations de sécurité
         */
        $signature = $request->header(
            'X-Webhook-Signature'
        );

        $timestamp = $request->header(
            'X-Webhook-Timestamp'
        );

        $eventHeader = $request->header(
            'X-Webhook-Event'
        );

        /*
         * 2. Vérifier que les headers nécessaires existent
         */
        if (! $signature || ! $timestamp) {
            return response()->json([
                'message' => 'Signature webhook manquante.',
            ], 401);
        }

        /*
         * 3. Protection contre les anciennes requêtes
         *
         * GeniusPay recommande une fenêtre de 5 minutes.
         */
        if (
            ! is_numeric($timestamp) ||
            abs(time() - (int) $timestamp) > 300
        ) {
            return response()->json([
                'message' => 'Webhook expiré.',
            ], 400);
        }

        /*
         * 4. Récupérer le corps JSON brut
         *
         * C'est important pour la vérification de la signature.
         */
        $rawPayload = $request->getContent();

        /*
         * 5. Recalculer la signature HMAC-SHA256
         *
         * Format documenté :
         *
         * timestamp + "." + json_payload
         */
        $signedData =
            $timestamp.'.'.$rawPayload;

        $expectedSignature = hash_hmac(
            'sha256',
            $signedData,
            config('services.geniuspay.webhook_secret')
        );

        /*
         * 6. Vérifier la signature
         */
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

        /*
         * 7. Décoder le JSON
         */
        $payload = json_decode(
            $rawPayload,
            true
        );

        if (! is_array($payload)) {
            return response()->json([
                'message' => 'Payload invalide.',
            ], 400);
        }

        /*
         * 8. Récupérer l'événement
         */
        $event = $payload['event'] ?? $eventHeader;

        if (! $event) {
            return response()->json([
                'message' => 'Événement manquant.',
            ], 400);
        }

        /*
         * 9. Nous ne traitons que les événements
         * de paiement que nous connaissons.
         */
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

        /*
         * 10. Récupérer les données du paiement
         */
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

        /*
         * 11. Récupérer notre paiement
         */
        $payment = Payment::where(
            'transaction_id',
            $reference
        )->first();

        if (! $payment) {
            return response()->json([
                'message' => 'Paiement introuvable.',
            ], 404);
        }

        /*
         * Vérification supplémentaire :
         * le metadata order_id doit correspondre
         * à notre Payment.
         */
        if ((string) $payment->order_id !== (string) $orderId) {
            return response()->json([
                'message' => 'La commande ne correspond pas au paiement.',
            ], 400);
        }

        /*
         * 12. Éviter de traiter plusieurs fois
         * un paiement déjà terminé.
         */
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

        /*
         * 13. Traiter le résultat
         */
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

        /*
         * 14. GeniusPay attend généralement
         * une réponse HTTP 200.
         */
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
        /*
         * Un paiement échoué / annulé / expiré
         * ne doit pas laisser le stock bloqué.
         */
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
