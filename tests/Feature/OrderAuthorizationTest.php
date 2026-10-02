<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_view_own_order(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'pending',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $client->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($client)
            ->get(route('client.orders.show', $order));

        $response->assertOk();
    }

    public function test_client_cannot_view_another_clients_order(): void
    {
        $clientA = User::factory()->create([
            'role' => 'client',
        ]);

        $clientB = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $clientA->id,
            'status' => 'pending',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $clientA->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($clientB)
            ->get(route('client.orders.show', $order));

        $response->assertForbidden();
    }

    public function test_client_can_cancel_own_pending_order(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'pending',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $client->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($client)
            ->patch(route('client.orders.cancel', $order));

        $response->assertSessionHas(
            'success',
            'Votre commande a été annulée.'
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_client_cannot_cancel_another_clients_order(): void
    {
        $clientA = User::factory()->create([
            'role' => 'client',
        ]);

        $clientB = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $clientA->id,
            'status' => 'pending',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $clientA->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($clientB)
            ->patch(route('client.orders.cancel', $order));

        $response->assertForbidden();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }

    public function test_client_cannot_cancel_a_non_pending_order(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'confirmed',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $client->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($client)
            ->patch(route('client.orders.cancel', $order));

        $response->assertForbidden();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'confirmed',
        ]);
    }
}
