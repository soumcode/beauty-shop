<?php

namespace Tests\Feature;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_driver_can_mark_delivery_as_picked_up(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'assigned',
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

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        $response = $this
            ->actingAs($driver)
            ->patch(
                route(
                    'livreur.deliveries.update-status',
                    $delivery
                ),
                [
                    'status' => 'picked_up',
                ]
            );

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('deliveries', [
            'id' => $delivery->id,
            'status' => 'picked_up',
        ]);
    }

    public function test_driver_can_mark_delivery_as_out_for_delivery(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'assigned',
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

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'picked_up',
            'assigned_at' => now(),
            'picked_up_at' => now(),
        ]);

        $response = $this
            ->actingAs($driver)
            ->patch(
                route(
                    'livreur.deliveries.update-status',
                    $delivery
                ),
                [
                    'status' => 'out_for_delivery',
                ]
            );

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('deliveries', [
            'id' => $delivery->id,
            'status' => 'out_for_delivery',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'out_for_delivery',
        ]);
    }

    public function test_driver_can_mark_delivery_as_delivered(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'out_for_delivery',
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

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'out_for_delivery',
            'assigned_at' => now(),
            'picked_up_at' => now(),
        ]);

        $response = $this
            ->actingAs($driver)
            ->patch(
                route(
                    'livreur.deliveries.update-status',
                    $delivery
                ),
                [
                    'status' => 'delivered',
                ]
            );

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('deliveries', [
            'id' => $delivery->id,
            'status' => 'delivered',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'delivered',
        ]);
    }

    public function test_driver_cannot_skip_delivery_statuses(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'assigned',
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

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        $response = $this
            ->actingAs($driver)
            ->patch(
                route(
                    'livreur.deliveries.update-status',
                    $delivery
                ),
                [
                    'status' => 'delivered',
                ]
            );

        $response->assertSessionHasErrors('status');

        $this->assertDatabaseHas('deliveries', [
            'id' => $delivery->id,
            'status' => 'assigned',
        ]);
    }

    public function test_client_cannot_update_delivery_status(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $order = Order::forceCreate([
            'user_id' => $client->id,
            'status' => 'assigned',
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

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        $response = $this
            ->actingAs($client)
            ->patch(
                route(
                    'livreur.deliveries.update-status',
                    $delivery
                ),
                [
                    'status' => 'picked_up',
                ]
            );

        $response->assertForbidden();

        $this->assertDatabaseHas('deliveries', [
            'id' => $delivery->id,
            'status' => 'assigned',
        ]);
    }
}
