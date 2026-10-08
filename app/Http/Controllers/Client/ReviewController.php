<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Ajouter un avis sur un produit.
     */
    public function store(Request $request, Product $product)
    {
        // Le produit doit être actif.
        if ($product->status !== 'active') {
            abort(404);
        }

        // Validation du formulaire.
        $validated = $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],
            'comment' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        // Vérifier que le client a bien reçu le produit.
        $hasPurchased = Order::where('user_id', auth()->id())
            ->where('status', 'delivered')
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        if (! $hasPurchased) {
            return back()->with(
                'error',
                'Vous devez avoir reçu ce produit avant de pouvoir laisser un avis.'
            );
        }

        // Vérifier que le client n'a pas déjà laissé un avis.
        $alreadyReviewed = Review::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->exists();

        if ($alreadyReviewed) {
            return back()->with(
                'error',
                'Vous avez déjà laissé un avis pour ce produit.'
            );
        }

        // Créer l'avis.
        Review::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with(
            'success',
            'Votre avis a été ajouté avec succès.'
        );
    }

    /**
     * Supprimer son propre avis.
     */
    public function destroy(Review $review)
    {
        // Un client ne peut supprimer que son propre avis.
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->delete();

        return back()->with(
            'success',
            'Votre avis a été supprimé.'
        );
    }
}
