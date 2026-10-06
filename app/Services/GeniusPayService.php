<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeniusPayService
{
    
    public function createPayment(Order $order): array
    {
        $response = Http::withHeaders([
            'X-API-Key' => config('services.geniuspay.api_key'),
            'X-API-Secret' => config('services.geniuspay.api_secret'),
            'Content-Type' => 'application/json',
        ])
            ->acceptJson()
            ->timeout(30)
            ->post(
                config('services.geniuspay.base_url').'/payments',
                [
                    'amount' => (int) $order->total,

                    'currency' => 'XOF',

                    'description' => "Commande Beauty Shop #{$order->id}",

                    'customer' => [
                        'name' => $order->delivery_name,

                        'email' => $order->user?->email,

                        'phone' => $order->delivery_phone,

                        'country' => 'CI',
                    ],

                    'success_url' => config('services.geniuspay.success_url'),

                    'error_url' => config('services.geniuspay.error_url'),

                    'metadata' => [
                        'order_id' => (string) $order->id,

                        'user_id' => (string) $order->user_id,
                    ],
                ]
            );

        
        if ($response->failed()) {
            throw new RuntimeException(
                'Impossible de contacter GeniusPay.'
            );
        }

        $data = $response->json();

        
        if (
            ! ($data['success'] ?? false) ||
            empty($data['data']['reference']) ||
            empty($data['data']['checkout_url'])
        ) {
            throw new RuntimeException(
                $data['message'] ??
                'GeniusPay n’a pas pu initialiser le paiement.'
            );
        }

        return [
            'id' => $data['data']['id'] ?? null,

            'reference' => $data['data']['reference'],

            'amount' => $data['data']['amount'] ??
                (int) $order->total,

            'currency' => $data['data']['currency'] ??
                'XOF',

            'status' => $data['data']['status'] ??
                'pending',

            'checkout_url' => $data['data']['checkout_url'],

            'payment_url' => $data['data']['payment_url'] ??
                $data['data']['checkout_url'],

            'environment' => $data['data']['environment'] ??
                null,

            'expires_at' => $data['data']['expires_at'] ??
                null,

            'metadata' => $data['data']['metadata'] ??
                [],
        ];
    }

    
    public function getPayment(string $reference): array
    {
        $response = Http::withHeaders([
            'X-API-Key' => config('services.geniuspay.api_key'),
            'X-API-Secret' => config('services.geniuspay.api_secret'),
            'Content-Type' => 'application/json',
        ])
            ->acceptJson()
            ->timeout(30)
            ->get(
                config('services.geniuspay.base_url').
                '/payments/'.
                urlencode($reference)
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Impossible de récupérer le paiement GeniusPay.'
            );
        }

        $data = $response->json();

        if (! ($data['success'] ?? false)) {
            throw new RuntimeException(
                $data['message'] ??
                'GeniusPay n’a pas pu récupérer le paiement.'
            );
        }

        return $data;
    }
}
