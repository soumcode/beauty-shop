<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_client_can_create_an_order(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::forceCreate([
            'name' => 'Pomades',
            'slug' => 'pomades-test',
            'description' => 'Catégorie de test',
            'is_active' => true,
        ]);

        $product = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Pomade Test',
            'slug' => 'pomade-test',
            'description' => 'Produit de test',
            'price' => 5000,
            'stock' => 10,
            'status' => 'active',
            'image' => null,
        ]);

        $response = $this
            ->actingAs($client)
            ->post(route('checkout.store'), [
                'items' => [
                    [
                        'id' => $product->id,
                        'quantity' => 2,
                    ],
                ],
                'name' => 'Client Test',
                'phone' => '0700000000',
                'city' => 'Abidjan',
                'commune' => 'Cocody',
                'quartier' => 'Riviera',
                'address' => 'Adresse de test',
                'payment_method' => 'cash_on_delivery',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'user_id' => $client->id,
            'status' => 'pending',
            'subtotal' => 10000,
            'delivery_fee' => 2000,
            'total' => 12000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 5000,
            'total' => 10000,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 8,
        ]);
    }

    public function test_checkout_uses_price_from_database(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::forceCreate([
            'name' => 'Parfums',
            'slug' => 'parfums-test',
            'description' => 'Catégorie de test',
            'is_active' => true,
        ]);

        $product = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Parfum Test',
            'slug' => 'parfum-test',
            'description' => 'Produit de test',
            'price' => 7500,
            'stock' => 10,
            'status' => 'active',
            'image' => null,
        ]);

        $response = $this
            ->actingAs($client)
            ->post(route('checkout.store'), [
                'items' => [
                    [
                        'id' => $product->id,
                        'quantity' => 1,
                        'price' => 1,
                    ],
                ],
                'name' => 'Client Test',
                'phone' => '0700000000',
                'city' => 'Abidjan',
                'commune' => 'Cocody',
                'quartier' => 'Riviera',
                'address' => 'Adresse de test',
                'payment_method' => 'cash_on_delivery',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 7500,
            'total' => 7500,
        ]);

        $this->assertDatabaseMissing('order_items', [
            'product_id' => $product->id,
            'unit_price' => 1,
        ]);
    }

    public function test_checkout_rejects_quantity_greater_than_stock(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::forceCreate([
            'name' => 'Stock Test',
            'slug' => 'stock-test',
            'description' => 'Catégorie de test',
            'is_active' => true,
        ]);

        $product = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Produit Stock Test',
            'slug' => 'produit-stock-test',
            'description' => 'Produit de test',
            'price' => 3000,
            'stock' => 2,
            'status' => 'active',
            'image' => null,
        ]);

        $response = $this
            ->actingAs($client)
            ->post(route('checkout.store'), [
                'items' => [
                    [
                        'id' => $product->id,
                        'quantity' => 5,
                    ],
                ],
                'name' => 'Client Test',
                'phone' => '0700000000',
                'city' => 'Abidjan',
                'commune' => 'Cocody',
                'quartier' => 'Riviera',
                'address' => 'Adresse de test',
                'payment_method' => 'cash_on_delivery',
            ]);

        $response->assertStatus(422);

        $this->assertDatabaseMissing('orders', [
            'user_id' => $client->id,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 2,
        ]);
    }

    public function test_cancelled_order_restores_stock(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::forceCreate([
            'name' => 'Annulation Test',
            'slug' => 'annulation-test',
            'description' => 'Catégorie de test',
            'is_active' => true,
        ]);

        $product = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Produit Annulation',
            'slug' => 'produit-annulation',
            'description' => 'Produit de test',
            'price' => 4000,
            'stock' => 10,
            'status' => 'active',
            'image' => null,
        ]);

        $checkoutResponse = $this
            ->actingAs($client)
            ->post(route('checkout.store'), [
                'items' => [
                    [
                        'id' => $product->id,
                        'quantity' => 3,
                    ],
                ],
                'name' => 'Client Test',
                'phone' => '0700000000',
                'city' => 'Abidjan',
                'commune' => 'Cocody',
                'quartier' => 'Riviera',
                'address' => 'Adresse de test',
                'payment_method' => 'cash_on_delivery',
            ]);

        $checkoutResponse->assertRedirect();

        $product->refresh();

        $this->assertSame(7, $product->stock);

        $order = $client->orders()
            ->latest()
            ->firstOrFail();

        $cancelResponse = $this
            ->actingAs($client)
            ->patch(
                route('client.orders.cancel', $order)
            );

        $cancelResponse->assertSessionHas(
            'success',
            'Votre commande a été annulée.'
        );

        $product->refresh();

        $this->assertSame(10, $product->stock);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_out_of_stock_products_are_hidden_from_the_catalog(): void
    {
        $client = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::forceCreate([
            'name' => 'Soins',
            'slug' => 'soins-test',
            'description' => 'Catégorie de test',
            'is_active' => true,
        ]);

        $availableProduct = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Sérum disponible',
            'slug' => 'serum-disponible',
            'description' => 'Produit de test',
            'price' => 5000,
            'stock' => 4,
            'status' => 'active',
            'image' => null,
        ]);

        $soldOutProduct = Product::forceCreate([
            'category_id' => $category->id,
            'created_by' => $client->id,
            'name' => 'Sérum épuisé',
            'slug' => 'serum-epuise',
            'description' => 'Produit de test',
            'price' => 5000,
            'stock' => 0,
            'status' => 'active',
            'image' => null,
        ]);

        $activeInStockProducts = Product::query()
            ->where('status', 'active')
            ->where('stock', '>', 0)
            ->pluck('id')
            ->all();

        $this->assertContains($availableProduct->id, $activeInStockProducts);
        $this->assertNotContains($soldOutProduct->id, $activeInStockProducts);

        $this->get(route('products.show', $soldOutProduct))
            ->assertNotFound();
    }

    public function test_products_and_cart_pages_are_accessible(): void
    {
        $this->get(route('products.index'))->assertOk();
        $this->get(route('cart.index'))->assertOk();
    }

    public function test_homepage_does_not_accept_webhook_posts(): void
    {
        $this->post('/')->assertStatus(405);
    }
}
