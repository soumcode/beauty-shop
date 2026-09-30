import { Link } from '@inertiajs/react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

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
                        {cartItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
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

                                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                                {/* Quantité */}
                                                <div className="flex items-center rounded-md border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </Button>

                                                    <span className="w-10 text-center">
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </div>

                                                {/* Suppression */}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Sous-total */}
                                        <div className="text-right">
                                            <p className="font-bold">
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}{' '}
                                                FCFA
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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

                            <Button
                                className="mt-6 w-full"
                                disabled
                            >
                                Passer la commande
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
