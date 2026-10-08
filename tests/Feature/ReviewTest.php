<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(string $email = 'client@test.com'): User
    {
        return User::create([
            'name' => 'Client Test',
            'email' => $email,
            'password' => 'password',
            'role' => 'client',
            'phone' => '0700000000',
        ]);
    }

    private function createProduct(): Product
    {
        $category = Category::create([
            'name' => 'Parfums',
            'slug' => 'parfums',
            'description' => 'Catégorie de parfums',
            'is_active' => true,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Parfum Test',
            'slug' => 'parfum-test',
            'description' => 'Produit de test',
            'price' => 5000,
            'stock' => 10,
            'image' => null,
            'status' => 'active',
        ]);
    }

    private function createDeliveredOrder(
        User $user,
        Product $product
    ): Order {
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'delivered',
            'subtotal' => 5000,
            'delivery_fee' => 2000,
            'total' => 7000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'paid',
            'delivery_name' => $user->name,
            'delivery_phone' => $user->phone,
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Angré',
            'delivery_address' => 'Adresse de test',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 5000,
            'total' => 5000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $order;
    }

    public function test_guest_cannot_leave_review(): void
    {
        $product = $this->createProduct();

        $response = $this->post(
            route(
                'client.reviews.store',
                $product
            ),
            [
                'rating' => 5,
                'comment' => 'Excellent produit.',
            ]
        );

        $response->assertRedirect(
            route('login')
        );

        $this->assertDatabaseCount(
            'reviews',
            0
        );
    }

    public function test_client_cannot_review_product_before_delivery(): void
    {
        $user = $this->createUser(
            'before@test.com'
        );

        $product = $this->createProduct();

        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => 5000,
            'delivery_fee' => 2000,
            'total' => 7000,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'delivery_name' => $user->name,
            'delivery_phone' => $user->phone,
            'delivery_city' => 'Abidjan',
            'delivery_commune' => 'Cocody',
            'delivery_quartier' => 'Angré',
            'delivery_address' => 'Adresse de test',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 5000,
            'total' => 5000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'client.reviews.store',
                    $product
                ),
                [
                    'rating' => 5,
                    'comment' => 'Excellent produit.',
                ]
            );

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'Vous devez avoir reçu ce produit avant de pouvoir laisser un avis.'
        );

        $this->assertDatabaseCount(
            'reviews',
            0
        );
    }

    public function test_client_can_leave_review_after_delivery(): void
    {
        $user = $this->createUser(
            'delivered@test.com'
        );

        $product = $this->createProduct();

        $this->createDeliveredOrder(
            $user,
            $product
        );

        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'client.reviews.store',
                    $product
                ),
                [
                    'rating' => 5,
                    'comment' => 'Excellent produit.',
                ]
            );

        $response->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Excellent produit.',
        ]);
    }

    public function test_rating_must_be_between_one_and_five(): void
    {
        $user = $this->createUser(
            'rating@test.com'
        );

        $product = $this->createProduct();

        $this->createDeliveredOrder(
            $user,
            $product
        );

        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'client.reviews.store',
                    $product
                ),
                [
                    'rating' => 6,
                    'comment' => 'Mauvaise note.',
                ]
            );

        $response->assertSessionHasErrors(
            'rating'
        );

        $this->assertDatabaseCount(
            'reviews',
            0
        );
    }

    public function test_client_cannot_leave_two_reviews_for_same_product(): void
    {
        $user = $this->createUser(
            'duplicate@test.com'
        );

        $product = $this->createProduct();

        $this->createDeliveredOrder(
            $user,
            $product
        );

        $this
            ->actingAs($user)
            ->post(
                route(
                    'client.reviews.store',
                    $product
                ),
                [
                    'rating' => 5,
                    'comment' => 'Premier avis.',
                ]
            );

        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'client.reviews.store',
                    $product
                ),
                [
                    'rating' => 4,
                    'comment' => 'Deuxième avis.',
                ]
            );

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'Vous avez déjà laissé un avis pour ce produit.'
        );

        $this->assertDatabaseCount(
            'reviews',
            1
        );
    }

    public function test_client_can_delete_his_own_review(): void
    {
        $user = $this->createUser(
            'delete@test.com'
        );

        $product = $this->createProduct();

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Très bon produit.',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(
                route(
                    'client.reviews.destroy',
                    $review
                )
            );

        $response->assertRedirect();

        $this->assertDatabaseMissing('reviews', [
            'id' => $review->id,
        ]);
    }

    public function test_client_cannot_delete_another_user_review(): void
    {
        $owner = $this->createUser(
            'owner@test.com'
        );

        $otherUser = $this->createUser(
            'other@test.com'
        );

        $product = $this->createProduct();

        $review = Review::create([
            'user_id' => $owner->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Très bon produit.',
        ]);

        $response = $this
            ->actingAs($otherUser)
            ->delete(
                route(
                    'client.reviews.destroy',
                    $review
                )
            );

        $response->assertForbidden();

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
        ]);
    }
}
