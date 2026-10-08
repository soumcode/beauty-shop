import { Link } from '@inertiajs/react'
import PublicLayout from '@/layouts/PublicLayout'

import {
    AlertTriangle,
    Minus,
    Plus,
    Trash2,
} from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { useCart } from '@/contexts/CartContext'

export default function Cart() {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        getCartTotal,
    } = useCart()

    const total = getCartTotal()

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-muted/30 p-6">

                <div className="mx-auto max-w-4xl">

                    <Card>

                        <CardContent className="py-16 text-center">

                            <h1 className="text-2xl font-bold">
                                Votre panier est vide
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Ajoutez des produits pour
                                commencer vos achats.
                            </p>

                            <Button
                                asChild
                                className="mt-6"
                            >
                                <Link
                                    href={route(
                                        'products.index'
                                    )}
                                >
                                    Voir les produits
                                </Link>
                            </Button>

                        </CardContent>

                    </Card>

                </div>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-6xl">

                {/* En-tête */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Mon panier
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Vérifiez vos produits avant de
                        passer votre commande.
                    </p>

                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Produits */}

                    <div className="space-y-4 lg:col-span-2">

                        {cartItems.map((item) => {
                            const stock =
                                Number(item.stock) || 0

                            const quantity =
                                Number(
                                    item.quantity
                                ) || 0

                            const isAtStockLimit =
                                quantity >= stock

                            const isOutOfStock =
                                stock <= 0

                            return (
                                <Card key={item.id}>

                                    <CardContent className="p-4">

                                        <div className="flex flex-col gap-4 sm:flex-row">

                                            {/* Image */}

                                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">

                                                {item.image ? (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                        Pas d'image
                                                    </div>
                                                )}

                                            </div>

                                            {/* Informations */}

                                            <div className="flex flex-1 flex-col justify-between">

                                                <div>

                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                                        <div>
                                                            <h2 className="font-semibold">
                                                                {item.name}
                                                            </h2>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {Number(
                                                                    item.price
                                                                ).toLocaleString(
                                                                    'fr-FR'
                                                                )}{' '}
                                                                FCFA
                                                            </p>
                                                        </div>

                                                        <p className="font-bold">

                                                            {(
                                                                Number(
                                                                    item.price
                                                                ) *
                                                                quantity
                                                            ).toLocaleString(
                                                                'fr-FR'
                                                            )}{' '}
                                                            FCFA

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* Stock */}

                                                <div className="mt-4">

                                                    {isOutOfStock ? (
                                                        <Badge variant="destructive">
                                                            Rupture de stock
                                                        </Badge>
                                                    ) : isAtStockLimit ? (
                                                        <Badge variant="secondary">
                                                            Stock maximum atteint
                                                        </Badge>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">
                                                            Stock disponible :{' '}
                                                            {stock}
                                                        </p>
                                                    )}

                                                </div>

                                                {/* Quantité */}

                                                <div className="mt-4 flex flex-wrap items-center gap-3">

                                                    <div className="flex items-center rounded-md border">

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                decreaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>

                                                        <span className="w-10 text-center font-medium">
                                                            {
                                                                quantity
                                                            }
                                                        </span>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                increaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                isAtStockLimit ||
                                                                isOutOfStock
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>

                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Supprimer
                                                    </Button>

                                                </div>

                                            </div>

                                        </div>

                                    </CardContent>

                                </Card>
                            )
                        })}

                    </div>

                    {/* Résumé */}

                    <Card className="h-fit">

                        <CardHeader>

                            <CardTitle>
                                Résumé
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="flex justify-between">

                                <span>
                                    Produits
                                </span>

                                <span>
                                    {total.toLocaleString(
                                        'fr-FR'
                                    )}{' '}
                                    FCFA
                                </span>

                            </div>

                            <div className="mt-4 flex justify-between">

                                <span>
                                    Livraison
                                </span>

                                <span>
                                    À calculer
                                </span>

                            </div>

                            <div className="my-4 border-t" />

                            <div className="flex justify-between text-lg font-bold">

                                <span>
                                    Sous-total
                                </span>

                                <span>
                                    {total.toLocaleString(
                                        'fr-FR'
                                    )}{' '}
                                    FCFA
                                </span>

                            </div>

                            {/* Avertissement stock */}

                            {cartItems.some(
                                (item) =>
                                    Number(
                                        item.stock
                                    ) <= 0
                            ) && (
                                <div className="mt-4 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">

                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                                    <p className="text-destructive">
                                        Un produit de votre panier
                                        n'est plus disponible.
                                        Supprimez-le avant de
                                        continuer.
                                    </p>

                                </div>
                            )}

                            <Button
                                asChild
                                className="mt-6 w-full"
                                disabled={
                                    cartItems.some(
                                        (item) =>
                                            Number(
                                                item.stock
                                            ) <= 0 ||
                                            Number(
                                                item.quantity
                                            ) >
                                                Number(
                                                    item.stock
                                                )
                                    )
                                }
                            >
                                <Link
                                    href={route(
                                        'checkout'
                                    )}
                                >
                                    Passer la commande
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="mt-3 w-full"
                            >
                                <Link
                                    href={route(
                                        'products.index'
                                    )}
                                >
                                    Continuer mes achats
                                </Link>
                            </Button>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    )
}

Cart.layout = (page) => (
    <PublicLayout>
        {page}
    </PublicLayout>
)
