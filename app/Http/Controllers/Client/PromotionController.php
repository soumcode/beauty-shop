<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function check(Request $request)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
            ],
            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        $code = strtoupper(
            trim($validated['code'])
        );

        $subtotal = (float) $validated['subtotal'];

        $promotion = Promotion::where(
            'code',
            $code
        )->first();

        if (! $promotion) {
            return response()->json([
                'valid' => false,
                'message' => 'Code promo invalide.',
            ], 422);
        }

        if (! $promotion->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'Cette promotion est désactivée.',
            ], 422);
        }

        $now = now();

        if (
            $promotion->starts_at
            && $now->lt($promotion->starts_at)
        ) {
            return response()->json([
                'valid' => false,
                'message' => 'Cette promotion n\'est pas encore disponible.',
            ], 422);
        }

        if (
            $promotion->ends_at
            && $now->gt($promotion->ends_at)
        ) {
            return response()->json([
                'valid' => false,
                'message' => 'Cette promotion a expiré.',
            ], 422);
        }

        if (
            $promotion->usage_limit !== null
            && $promotion->usage_count >= $promotion->usage_limit
        ) {
            return response()->json([
                'valid' => false,
                'message' => 'Cette promotion a atteint sa limite d\'utilisation.',
            ], 422);
        }

        if (
            $promotion->min_order_amount !== null
            && $subtotal < (float) $promotion->min_order_amount
        ) {
            return response()->json([
                'valid' => false,
                'message' => 'Le montant minimum pour utiliser cette promotion est de '
                    .number_format(
                        (float) $promotion->min_order_amount,
                        0,
                        ',',
                        ' '
                    )
                    .' FCFA.',
            ], 422);
        }

        if ($promotion->type === 'percentage') {
            $discount =
                $subtotal *
                ((float) $promotion->value / 100);

            if (
                $promotion->max_discount !== null
                && $discount > (float) $promotion->max_discount
            ) {
                $discount =
                    (float) $promotion->max_discount;
            }
        } else {
            $discount = (float) $promotion->value;
        }

        // La réduction ne peut jamais dépasser le sous-total.
        $discount = min(
            $discount,
            $subtotal
        );

        return response()->json([
            'valid' => true,

            'promotion' => [
                'id' => $promotion->id,
                'code' => $promotion->code,
                'name' => $promotion->name,
                'type' => $promotion->type,
                'value' => (float) $promotion->value,
            ],

            'discount' => round(
                $discount,
                2
            ),
        ]);
    }
}
