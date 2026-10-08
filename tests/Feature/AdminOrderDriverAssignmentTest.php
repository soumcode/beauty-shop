<?php

namespace Tests\Feature;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AdminOrderDriverAssignmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_next_statuses_and_labels_for_a_confirmed_order(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $order = $this->createOrder($client, 'confirmed');

        $this->actingAs($admin)
            ->get(route('admin.orders.show', $order))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Orders/Show', false)
                ->where('statusOptions.confirmed', 'Confirmée')
                ->where('statusOptions.preparing', 'En préparation')
                ->where('nextStatusOptions.0', 'preparing')
                ->where('nextStatusOptions.1', 'cancelled')
            );
    }

    public function test_admin_sees_delivery_zones_and_available_drivers_on_the_orders_list(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $order = $this->createOrder($client);
        $order->update([
            'delivery_commune' => 'Adjamé',
            'delivery_quartier' => 'Williamsville',
        ]);
        $activeOrder = $this->createOrder($client, 'assigned');
        Delivery::forceCreate([
            'order_id' => $activeOrder->id,
            'driver_id' => $driver->id,
            'status' => 'out_for_delivery',
            'assigned_at' => now(),
            'picked_up_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.orders.index', [
                'status' => 'ready',
            ]))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Orders/Index', false)
                ->has('orders.data', 1, fn (AssertableInertia $page) => $page
                    ->where('id', $order->id)
                    ->where('delivery_commune', 'Adjamé')
                    ->where('delivery_quartier', 'Williamsville')
                    ->etc()
                )
                ->has('availableDrivers', 1, fn (AssertableInertia $page) => $page
                    ->where('id', $driver->id)
                    ->where('name', $driver->name)
                    ->etc()
                )
            );
    }

    public function test_admin_can_filter_orders_by_delivery_commune_or_quartier(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $communeMatch = $this->createOrder($client);
        $communeMatch->update([
            'delivery_commune' => 'Adjamé',
            'delivery_quartier' => 'Saint-Michel',
        ]);
        $quarterMatch = $this->createOrder($client);
        $quarterMatch->update([
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Adjamé Extension',
        ]);
        $otherOrder = $this->createOrder($client);
        $otherOrder->update([
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Riviera',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.orders.index', [
                'zone' => 'Adjamé',
            ]))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Orders/Index', false)
                ->where('filters.zone', 'Adjamé')
                ->has('orders.data', 2)
                ->where('orders.data.0.id', $communeMatch->id)
                ->where('orders.data.1.id', $quarterMatch->id)
                ->missing('orders.data.2')
            );
    }

    public function test_admin_can_assign_an_available_driver_to_a_ready_order(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $order = $this->createOrder($client);

        $this->actingAs($admin)
            ->get(route('admin.orders.show', $order))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Orders/Show', false)
                ->has('availableDrivers', 1, fn (AssertableInertia $page) => $page
                    ->where('id', $driver->id)
                    ->where('name', $driver->name)
                    ->etc()
                )
            );

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.assign-driver', $order), [
                'driver_id' => $driver->id,
            ]);

        $response->assertSessionHas(
            'success',
            'Livreur affecté à la commande.'
        );

        $this->assertDatabaseHas('deliveries', [
            'order_id' => $order->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'assigned',
        ]);
        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $order->id,
            'status' => 'assigned',
            'changed_by' => $admin->id,
        ]);
    }

    public function test_admin_can_assign_another_order_to_a_driver_who_already_has_an_active_delivery(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $activeOrder = $this->createOrder($client, 'assigned');
        Delivery::forceCreate([
            'order_id' => $activeOrder->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);
        $orderToAssign = $this->createOrder($client);

        $this->actingAs($admin)
            ->get(route('admin.orders.show', $orderToAssign))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Orders/Show', false)
                ->has('availableDrivers', 1, fn (AssertableInertia $page) => $page
                    ->where('id', $driver->id)
                    ->etc()
                )
            );

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.assign-driver', $orderToAssign), [
                'driver_id' => $driver->id,
            ]);

        $response->assertSessionHas(
            'success',
            'Livreur affecté à la commande.'
        );

        $this->assertDatabaseHas('deliveries', [
            'order_id' => $orderToAssign->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
        ]);
        $this->assertDatabaseHas('deliveries', [
            'order_id' => $activeOrder->id,
            'driver_id' => $driver->id,
            'status' => 'assigned',
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $orderToAssign->id,
            'status' => 'assigned',
        ]);
    }

    public function test_admin_can_assign_multiple_ready_orders_to_the_same_driver(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $firstOrder = $this->createOrder($client);
        $secondOrder = $this->createOrder($client);
        $firstOrder->update([
            'delivery_commune' => 'Adjamé',
            'delivery_quartier' => 'Williamsville',
        ]);
        $secondOrder->update([
            'delivery_commune' => 'Adjamé',
            'delivery_quartier' => '220 Logements',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.assign-driver-batch'), [
                'driver_id' => $driver->id,
                'order_ids' => [
                    $firstOrder->id,
                    $secondOrder->id,
                ],
            ]);

        $response->assertSessionHas(
            'success',
            'Commandes affectées au livreur.'
        );

        foreach ([$firstOrder, $secondOrder] as $order) {
            $this->assertDatabaseHas('deliveries', [
                'order_id' => $order->id,
                'driver_id' => $driver->id,
                'status' => 'assigned',
            ]);
            $this->assertDatabaseHas('orders', [
                'id' => $order->id,
                'status' => 'assigned',
            ]);
            $this->assertDatabaseHas('order_status_histories', [
                'order_id' => $order->id,
                'status' => 'assigned',
                'changed_by' => $admin->id,
            ]);
        }
    }

    public function test_batch_assignment_leaves_all_orders_unchanged_if_one_is_not_ready(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $readyOrder = $this->createOrder($client);
        $preparingOrder = $this->createOrder($client, 'preparing');

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.assign-driver-batch'), [
                'driver_id' => $driver->id,
                'order_ids' => [
                    $readyOrder->id,
                    $preparingOrder->id,
                ],
            ]);

        $response->assertSessionHasErrors([
            'order_ids' => 'Toutes les commandes sélectionnées doivent être prêtes avant leur affectation.',
        ]);

        $this->assertDatabaseMissing('deliveries', [
            'order_id' => $readyOrder->id,
        ]);
        $this->assertDatabaseMissing('deliveries', [
            'order_id' => $preparingOrder->id,
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $readyOrder->id,
            'status' => 'ready',
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $preparingOrder->id,
            'status' => 'preparing',
        ]);
    }

    public function test_admin_cannot_assign_a_driver_before_the_order_is_ready(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $order = $this->createOrder($client, 'preparing');

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.assign-driver', $order), [
                'driver_id' => $driver->id,
            ]);

        $response->assertSessionHasErrors('driver_id');

        $this->assertDatabaseMissing('deliveries', [
            'order_id' => $order->id,
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'preparing',
        ]);
    }

    public function test_client_cannot_assign_a_driver_to_an_order(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);
        $driver = User::factory()->create([
            'role' => 'livreur',
        ]);
        $order = $this->createOrder($client);

        $response = $this->actingAs($client)
            ->post(route('admin.orders.assign-driver', $order), [
                'driver_id' => $driver->id,
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('deliveries', [
            'order_id' => $order->id,
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'ready',
        ]);
    }

    private function createOrder(User $client, string $status = 'ready'): Order
    {
        return Order::forceCreate([
            'user_id' => $client->id,
            'status' => $status,
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
    }
}
