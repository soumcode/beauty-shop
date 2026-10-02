<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

test('client can confirm an order and is redirected to its confirmation page', function () {
    $user = User::factory()->create();

    $category = Category::create([
        'name' => 'Parfums',
        'slug' => 'parfums',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Parfum Fresh',
        'slug' => 'parfum-fresh',
        'price' => 18000,
        'stock' => 3,
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('checkout.store'), [
            'name' => 'Awa',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Près de la pharmacie',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

    $order = Order::query()->sole();

    $response->assertRedirectToRoute('orders.confirmation', [
        'order' => $order->id,
    ]);

    $this->assertModelExists($order);
    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 18000,
        'total' => 18000,
    ]);
    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'status' => 'pending',
    ]);

    expect($product->refresh()->stock)->toBe(2);
    expect((float) $order->total)->toBe(20000.0);

    $this
        ->actingAs($user)
        ->get(route('orders.confirmation', $order))
        ->assertOk();

    $this
        ->actingAs(User::factory()->create())
        ->get(route('orders.confirmation', $order))
        ->assertNotFound();
});

test('guest cannot confirm an order', function () {
    $response = $this->post(route('checkout.store'), []);

    $response->assertRedirect(route('login'));
    $this->assertDatabaseCount('orders', 0);
});
