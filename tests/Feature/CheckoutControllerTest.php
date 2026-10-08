<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;

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
            'payment_method' => 'cash_on_delivery',
            'payment_provider' => 'wave_ci',
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
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'payment_provider' => null,
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

test('client can start an online payment with GeniusPay', function (string $paymentProvider) {
    config([
        'services.geniuspay.api_key' => 'test-api-key',
        'services.geniuspay.api_secret' => 'test-api-secret',
        'services.geniuspay.base_url' => 'https://geniuspay.test/api/v1',
        'services.geniuspay.success_url' => 'https://beauty-shop.test/paiement/succes',
        'services.geniuspay.error_url' => 'https://beauty-shop.test/paiement/echec',
    ]);

    Http::preventStrayRequests();
    Http::fake([
        'https://geniuspay.test/api/v1/payments' => Http::response([
            'success' => true,
            'data' => [
                'reference' => 'payment-reference-123',
                'payment_url' => 'https://checkout.geniuspay.test/payment-reference-123',
            ],
        ]),
    ]);

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
        ->withHeader('X-Inertia', 'true')
        ->post(route('checkout.store'), [
            'name' => 'Awa',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Près de la pharmacie',
            'payment_method' => 'online',
            'payment_provider' => $paymentProvider,
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

    $order = Order::query()->sole();

    $response->assertStatus(409);
    $response->assertHeader(
        'X-Inertia-Location',
        'https://checkout.geniuspay.test/payment-reference-123'
    );
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'payment_method' => 'online',
        'payment_provider' => $paymentProvider,
        'payment_status' => 'pending',
    ]);
    $this->assertDatabaseHas('payments', [
        'order_id' => $order->id,
        'transaction_id' => 'payment-reference-123',
        'amount' => 20000,
        'currency' => 'XOF',
        'status' => 'pending',
    ]);
    expect($product->refresh()->stock)->toBe(2);

    Http::assertSent(fn (ClientRequest $request): bool => $request->url() === 'https://geniuspay.test/api/v1/payments'
        && $request['amount'] === 20000
        && $request['payment_method'] === $paymentProvider
    );
})->with([
    'Wave' => 'wave_ci',
    'Orange Money' => 'orange_money_ci',
    'MTN Money' => 'mtn_money_ci',
]);

test('online payment requires a supported provider', function () {
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
        ->from(route('checkout'))
        ->post(route('checkout.store'), [
            'name' => 'Awa',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Près de la pharmacie',
            'payment_method' => 'online',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

    $response->assertRedirect(route('checkout'));
    $response->assertSessionHasErrors([
        'payment_provider' => 'Veuillez choisir Wave, Orange Money ou MTN Money.',
    ]);
    $this->assertDatabaseCount('orders', 0);
});

test('client order is cancelled and stock restored when GeniusPay rejects payment setup', function () {
    config([
        'services.geniuspay.api_key' => 'test-api-key',
        'services.geniuspay.api_secret' => 'test-api-secret',
        'services.geniuspay.base_url' => 'https://geniuspay.test/api/v1',
        'services.geniuspay.success_url' => 'https://beauty-shop.test/paiement/succes',
        'services.geniuspay.error_url' => 'https://beauty-shop.test/paiement/echec',
    ]);

    Http::preventStrayRequests();
    Http::fake([
        'https://geniuspay.test/api/v1/payments' => Http::response([
            'success' => false,
            'message' => 'Payment setup failed.',
        ], 503),
    ]);

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
        ->from(route('checkout'))
        ->post(route('checkout.store'), [
            'name' => 'Awa',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Près de la pharmacie',
            'payment_method' => 'online',
            'payment_provider' => 'orange_money_ci',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

    $order = Order::query()->sole();

    $response->assertRedirect(route('checkout'));
    $response->assertSessionHasErrors('payment');
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
        'payment_status' => 'failed',
    ]);
    expect($product->refresh()->stock)->toBe(3);
    $this->assertDatabaseCount('payments', 0);
});

test('client order is cancelled and stock restored when GeniusPay is unreachable', function () {
    config([
        'services.geniuspay.api_key' => 'test-api-key',
        'services.geniuspay.api_secret' => 'test-api-secret',
        'services.geniuspay.base_url' => 'https://geniuspay.test/api/v1',
        'services.geniuspay.success_url' => 'https://beauty-shop.test/paiement/succes',
        'services.geniuspay.error_url' => 'https://beauty-shop.test/paiement/echec',
    ]);

    Http::preventStrayRequests();
    Http::fake([
        'https://geniuspay.test/api/v1/payments' => Http::failedConnection(),
    ]);

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
        ->from(route('checkout'))
        ->post(route('checkout.store'), [
            'name' => 'Awa',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Près de la pharmacie',
            'payment_method' => 'online',
            'payment_provider' => 'mtn_money_ci',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

    $order = Order::query()->sole();

    $response->assertRedirect(route('checkout'));
    $response->assertSessionHasErrors('payment');
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
        'payment_status' => 'failed',
    ]);
    expect($product->refresh()->stock)->toBe(3);
    $this->assertDatabaseCount('payments', 0);
});
