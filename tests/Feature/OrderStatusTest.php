<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_confirm_pending_order(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

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
            'delivery_name' => 'Client Test',
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch(
                route('admin.orders.update-status', $order),
                [
                    'status' => 'confirmed',
                ]
            );

        $response->assertSessionHas(
            'success',
            'Statut de la commande mis à jour.'
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_admin_can_move_confirmed_order_to_preparing(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

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
            'delivery_name' => 'Client Test',
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch(
                route('admin.orders.update-status', $order),
                [
                    'status' => 'preparing',
                ]
            );

        $response->assertSessionHas(
            'success',
            'Statut de la commande mis à jour.'
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'preparing',
        ]);
    }

    public function test_admin_cannot_skip_order_statuses(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

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
            'delivery_name' => 'Client Test',
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patch(
                route('admin.orders.update-status', $order),
                [
                    'status' => 'delivered',
                ]
            );

        $response->assertSessionHasErrors('status');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }

    public function test_client_cannot_change_order_status(): void
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
            'delivery_name' => 'Client Test',
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $response = $this
            ->actingAs($client)
            ->patch(
                route('admin.orders.update-status', $order),
                [
                    'status' => 'confirmed',
                ]
            );

        $response->assertForbidden();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }
}
