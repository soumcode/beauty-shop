<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Afficher les favoris du client connecté.
     */
    public function index()
    {
        $favorites = Favorite::where('user_id', auth()->id())
            ->with('product.category')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Client/Favorites/Index', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Ajouter un produit aux favoris.
     */
    public function store(Request $request, Product $product)
    {
        if ($product->status !== 'active') {
            abort(404);
        }

        Favorite::firstOrCreate([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
        ]);

        return back()->with(
            'success',
            'Produit ajouté aux favoris.'
        );
    }

    /**
     * Retirer un produit des favoris.
     */
    public function destroy(Product $product)
    {
        Favorite::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->delete();

        return back()->with(
            'success',
            'Produit retiré des favoris.'
        );
    }
}
