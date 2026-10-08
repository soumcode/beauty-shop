<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionTest extends TestCase
{
    use RefreshDatabase;

    private function createClient(): User
    {
        return User::factory()->create([
            'role' => 'client',
        ]);
    }

    private function createProduct(
        float $price = 20000,
        int $stock = 10
    ): Product {
        $category = Category::create([
            'name' => 'Parfums',
            'slug' => 'parfums',
            'description' => null,
            'is_active' => true,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'created_by' => null,
            'name' => 'Parfum Test',
            'slug' => 'parfum-test-'.uniqid(),
            'description' => 'Produit de test',
            'price' => $price,
            'stock' => $stock,
            'image' => null,
            'status' => 'active',
        ]);
    }

    private function createAddress(
        User $user
    ): Address {
        return Address::create([
            'user_id' => $user->id,
            'name' => 'Soumaila',
            'phone' => '0700000000',
            'city' => 'Abidjan',
            'commune' => 'Cocody',
            'quartier' => 'Riviera',
            'address' => 'Adresse de test',
            'is_default' => true,
        ]);
    }

    public function test_guest_cannot_check_promotion(): void
    {
        $response = $this->get(
            route('client.promotions.check', [
                'code' => 'BIENVENUE10',
                'subtotal' => 20000,
            ])
        );

        $response->assertRedirect();
    }

    public function test_client_can_check_valid_percentage_promotion(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'BIENVENUE10',
            'name' => 'Bienvenue 10%',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => 10000,
            'max_discount' => null,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'BIENVENUE10',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertOk()
            ->assertJson([
                'valid' => true,
                'promotion' => [
                    'code' => 'BIENVENUE10',
                ],
                'discount' => 2000,
            ]);
    }

    public function test_client_can_check_fixed_promotion(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'PROMO2000',
            'name' => 'Réduction 2000 FCFA',
            'description' => null,
            'type' => 'fixed',
            'value' => 2000,
            'min_order_amount' => null,
            'max_discount' => null,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'PROMO2000',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertOk()
            ->assertJson([
                'valid' => true,
                'discount' => 2000,
            ]);
    }

    public function test_percentage_promotion_respects_max_discount(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'MAX5000',
            'name' => '10% maximum 5000',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => null,
            'max_discount' => 5000,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'MAX5000',
                'subtotal' => 100000,
            ])
        );

        $response
            ->assertOk()
            ->assertJson([
                'valid' => true,
                'discount' => 5000,
            ]);
    }

    public function test_promotion_requires_minimum_order_amount(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'MIN10000',
            'name' => 'Minimum 10000',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => 10000,
            'max_discount' => null,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'MIN10000',
                'subtotal' => 5000,
            ])
        );

        $response
            ->assertStatus(422)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_inactive_promotion_is_rejected(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'INACTIVE10',
            'name' => 'Promotion inactive',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => null,
            'max_discount' => null,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => false,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'INACTIVE10',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertStatus(422)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_expired_promotion_is_rejected(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'EXPIRE10',
            'name' => 'Promotion expirée',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => null,
            'max_discount' => null,
            'usage_limit' => null,
            'usage_count' => 0,
            'starts_at' => now()->subDays(5),
            'ends_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'EXPIRE10',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertStatus(422)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_promotion_usage_limit_is_respected(): void
    {
        $user = $this->createClient();

        Promotion::create([
            'code' => 'LIMITED10',
            'name' => 'Promotion limitée',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => null,
            'max_discount' => null,
            'usage_limit' => 10,
            'usage_count' => 10,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'LIMITED10',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertStatus(422)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_invalid_promotion_code_is_rejected(): void
    {
        $user = $this->createClient();

        $response = $this->actingAs($user)->getJson(
            route('client.promotions.check', [
                'code' => 'CODEFAUX',
                'subtotal' => 20000,
            ])
        );

        $response
            ->assertStatus(422)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_checkout_recalculates_discount_from_database(): void
    {
        $user = $this->createClient();

        $address = $this->createAddress($user);

        $product = $this->createProduct(
            price: 20000,
            stock: 10
        );

        $promotion = Promotion::create([
            'code' => 'SECURE10',
            'name' => 'Promotion sécurisée',
            'description' => null,
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => null,
            'max_discount' => null,
            'usage_limit' => 10,
            'usage_count' => 0,
            'starts_at' => null,
            'ends_at' => null,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(
            route('checkout.store'),
            [
                'address_id' => $address->id,

                'name' => $address->name,

                'phone' => $address->phone,

                'city' => $address->city,

                'commune' => $address->commune,

                'quartier' => $address->quartier,

                'address' => $address->address,

                'items' => [
                    [
                        'id' => $product->id,
                        'quantity' => 1,
                    ],
                ],

                'promotion_code' => $promotion->code,
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas(
            'orders',
            [
                'user_id' => $user->id,
                'promotion_id' => $promotion->id,
                'discount_amount' => 2000,
                'subtotal' => 20000,
                'delivery_fee' => 2000,
                'total' => 20000,
            ]
        );

        $this->assertDatabaseHas(
            'promotions',
            [
                'id' => $promotion->id,
                'usage_count' => 1,
            ]
        );

        $this->assertDatabaseHas(
            'products',
            [
                'id' => $product->id,
                'stock' => 9,
            ]
        );
    }
}
