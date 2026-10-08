<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('admin can view stock inventory and its statistics', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);
    $category = Category::create([
        'name' => 'Soins',
        'slug' => 'soins',
        'is_active' => true,
    ]);

    Product::create([
        'category_id' => $category->id,
        'name' => 'Produit en rupture',
        'slug' => 'produit-rupture',
        'price' => 1000,
        'stock' => 0,
    ]);
    Product::create([
        'category_id' => $category->id,
        'name' => 'Produit bientôt épuisé',
        'slug' => 'produit-faible',
        'price' => 2000,
        'stock' => 3,
    ]);
    Product::create([
        'category_id' => $category->id,
        'name' => 'Produit disponible',
        'slug' => 'produit-disponible',
        'price' => 3000,
        'stock' => 10,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.stock.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Stock/Index', false)
            ->where('statistics.totalProducts', 3)
            ->where('statistics.totalUnits', 13)
            ->where('statistics.outOfStock', 1)
            ->where('statistics.lowStock', 1)
            ->where('statistics.availableProducts', 1)
            ->has('products.data', 3)
            ->where('products.data.0.name', 'Produit en rupture')
        );
});
