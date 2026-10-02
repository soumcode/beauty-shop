<?php

namespace Tests\Feature;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_driver_can_view_own_delivery(): void
    {
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);

        $order = Order::forceCreate([
            'user_id' => User::factory()->create([
                'role' => 'client',
            ])->id,
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
            ->get(
                route(
                    'livreur.deliveries.show',
                    $delivery
                )
            );

        $response->assertOk();
    }

    public function test_driver_cannot_view_another_drivers_delivery(): void
    {
        $driverA = User::factory()->create([
            'role' => 'livreur',
        ]);

        $driverB = User::factory()->create([
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
            'delivery_name' => $client->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driverA->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        $response = $this
            ->actingAs($driverB)
            ->get(
                route(
                    'livreur.deliveries.show',
                    $delivery
                )
            );

        $response->assertForbidden();
    }

    public function test_driver_can_update_own_delivery_status(): void
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
            'delivery_name' => $client->name,
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

    public function test_driver_cannot_update_another_drivers_delivery(): void
    {
        $driverA = User::factory()->create([
            'role' => 'livreur',
        ]);

        $driverB = User::factory()->create([
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
            'delivery_name' => $client->name,
            'delivery_phone' => '0700000000',
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
            'delivery_address' => 'Adresse de test',
        ]);

        $delivery = Delivery::forceCreate([
            'order_id' => $order->id,
            'driver_id' => $driverA->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        $response = $this
            ->actingAs($driverB)
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
