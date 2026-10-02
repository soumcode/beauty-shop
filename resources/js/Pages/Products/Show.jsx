import { Link } from '@inertiajs/react'
import PublicLayout from '@/layouts/PublicLayout'

import {
    Card,
    CardContent,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { useCart } from '@/contexts/CartContext'

export default function Show({ product }) {
    const { addToCart } = useCart()

    const isAvailable = product.stock > 0

    const handleAddToCart = () => {
        addToCart(product)
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Retour */}
                <Button
                    variant="outline"
                    asChild
                    className="mb-8"
                >
                    <Link
                        href={route(
                            'products.index'
                        )}
                    >
                        ← Retour aux produits
                    </Link>
                </Button>

                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Image */}
                        <div className="min-h-[400px] bg-muted">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-muted-foreground">
                                    Aucune image
                                </div>
                            )}
                        </div>

                        {/* Informations */}
                        <CardContent className="flex flex-col justify-center p-8">
                            <Badge
                                variant="secondary"
                                className="mb-4 w-fit"
                            >
                                {product.category?.name}
                            </Badge>

                            <h1 className="text-3xl font-bold">
                                {product.name}
                            </h1>

                            <p className="mt-4 text-3xl font-bold">
                                {Number(
                                    product.price
                                ).toLocaleString(
                                    'fr-FR'
                                )}{' '}
                                FCFA
                            </p>

                            <div className="mt-4">
                                {isAvailable ? (
                                    <Badge>
                                        En stock
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        Rupture de stock
                                    </Badge>
                                )}
                            </div>

                            <div className="mt-6">
                                <h2 className="mb-2 text-lg font-semibold">
                                    Description
                                </h2>

                                <p className="leading-7 text-muted-foreground">
                                    {product.description ||
                                        'Aucune description disponible.'}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Stock disponible :{' '}
                                    {product.stock}
                                </p>
                            </div>

                            <Button
                                className="mt-8 w-full md:w-auto"
                                disabled={!isAvailable}
                                onClick={
                                    handleAddToCart
                                }
                            >
                                {isAvailable
                                    ? 'Ajouter au panier'
                                    : 'Produit indisponible'}
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    )
}


Show.layout = (page) => (
    <PublicLayout>
        {page}
    </PublicLayout>
)
