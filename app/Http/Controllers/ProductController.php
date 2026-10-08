<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $products = Product::with('category')
            ->where('status', 'active')
            ->where('stock', '>', 0)
            ->when($search, function ($query, $search) {
                $query->where(
                    'name',
                    'like',
                    "%{$search}%"
                );
            })
            ->when($category, function ($query, $category) {
                $query->where(
                    'category_id',
                    $category
                );
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        $favoriteProductIds = auth()->check()
            ? auth()->user()
                ->favorites()
                ->pluck('product_id')
                ->map(fn ($id) => (int) $id)
                ->values()
                ->all()
            : [];

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
            'favoriteProductIds' => $favoriteProductIds,
        ]);
    }

    public function show(Product $product)
    {
        if ($product->status !== 'active' || $product->stock <= 0) {
            abort(404);
        }

        $product->load([
            'category',
            'reviews' => function ($query) {
                $query
                    ->latest()
                    ->with('user:id,name');
            },
        ]);

        $isFavorite = auth()->check()
            ? auth()->user()
                ->favorites()
                ->where('product_id', $product->id)
                ->exists()
            : false;

        $averageRating = $product->reviews()
            ->avg('rating');

        $averageRating = $averageRating
            ? round((float) $averageRating, 1)
            : 0;

        $reviewCount = $product->reviews()->count();

        $canReview = false;
        $userReview = null;

        if (auth()->check()) {
            $userReview = $product->reviews
                ->firstWhere(
                    'user_id',
                    auth()->id()
                );

            $canReview = Order::where(
                'user_id',
                auth()->id()
            )
                ->where(
                    'status',
                    'delivered'
                )
                ->whereHas(
                    'items',
                    function ($query) use ($product) {
                        $query->where(
                            'product_id',
                            $product->id
                        );
                    }
                )
                ->exists();

            if ($userReview) {
                $canReview = false;
            }
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
            'isFavorite' => $isFavorite,
            'reviews' => $product->reviews,
            'averageRating' => $averageRating,
            'reviewCount' => $reviewCount,
            'canReview' => $canReview,
            'userReview' => $userReview,
        ]);
    }
}
