<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Afficher les produits de la boutique.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $products = Product::with('category')
            ->where('status', 'active')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($category, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,

            'categories' => $categories,

            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    /**
     * Afficher le détail d'un produit.
     */
    public function show(Product $product)
    {
        if (
            $product->status !== 'active'
        ) {
            abort(404);
        }

        $product->load('category');

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
