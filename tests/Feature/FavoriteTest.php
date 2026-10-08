<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_guest_cannot_add_favorite(): void
    {
        $product = $this->createProduct();

        $response = $this->post(
            route(
                'client.favorites.store',
                $product
            )
        );

        $response->assertRedirect(
            route('login')
        );

        $this->assertDatabaseMissing('favorites', [
            'product_id' => $product->id,
        ]);
    }

    public function test_authenticated_user_can_add_product_to_favorites(): void
    {
        $user = User::create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'password' => 'password',
            'role' => 'client',
            'phone' => '0700000000',
        ]);

        $product = $this->createProduct();

        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'client.favorites.store',
                    $product
                )
            );

        $response->assertRedirect();

        $this->assertDatabaseHas('favorites', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_authenticated_user_cannot_create_duplicate_favorite(): void
    {
        $user = User::create([
            'name' => 'Client Test',
            'email' => 'client2@test.com',
            'password' => 'password',
            'role' => 'client',
            'phone' => '0700000001',
        ]);

        $product = $this->createProduct();

        $this
            ->actingAs($user)
            ->post(
                route(
                    'client.favorites.store',
                    $product
                )
            );

        $this
            ->actingAs($user)
            ->post(
                route(
                    'client.favorites.store',
                    $product
                )
            );

        $this->assertDatabaseCount('favorites', 1);
    }

    public function test_authenticated_user_can_remove_favorite(): void
    {
        $user = User::create([
            'name' => 'Client Test',
            'email' => 'client3@test.com',
            'password' => 'password',
            'role' => 'client',
            'phone' => '0700000002',
        ]);

        $product = $this->createProduct();

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(
                route(
                    'client.favorites.destroy',
                    $product
                )
            );

        $response->assertRedirect();

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_user_can_view_his_favorites(): void
    {
        $user = User::create([
            'name' => 'Client Test',
            'email' => 'client4@test.com',
            'password' => 'password',
            'role' => 'client',
            'phone' => '0700000003',
        ]);

        $product = $this->createProduct();

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(
                route('client.favorites.index')
            );

        $response->assertOk();
    }
}
