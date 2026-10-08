import { Head, Link, router } from '@inertiajs/react'
import {
    Heart,
    Package,
    ShoppingBag,
    Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
} from '@/components/ui/card'

import AppLayout from '@/layouts/AppLayout'

export default function Index({ favorites }) {
    const removeFavorite = (productId) => {
        const confirmed = window.confirm(
            'Voulez-vous retirer ce produit de vos favoris ?'
        )

        if (!confirmed) {
            return
        }

        router.delete(
            route(
                'client.favorites.destroy',
                productId
            )
        )
    }

    return (
        <>
            <Head title="Mes favoris" />

            <div className="space-y-8 p-6">
                {/* En-tête */}
                <div>
                    <div className="flex items-center gap-3">
                        <Heart className="h-7 w-7 fill-current text-destructive" />

                        <h1 className="text-3xl font-bold">
                            Mes favoris
                        </h1>
                    </div>

                    <p className="mt-2 text-muted-foreground">
                        Retrouvez ici les produits que vous avez
                        enregistrés.
                    </p>
                </div>

                {/* Aucun favori */}
                {favorites.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h2 className="text-xl font-semibold">
                                Vous n'avez aucun favori
                            </h2>

                            <p className="mt-2 max-w-md text-muted-foreground">
                                Ajoutez des produits à vos favoris pour
                                pouvoir les retrouver facilement plus tard.
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
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Découvrir les produits
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Liste des favoris */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {favorites.data.map((favorite) => {
                                const product = favorite.product

                                return (
                                    <Card
                                        key={favorite.id}
                                        className="overflow-hidden"
                                    >
                                        {/* Image */}
                                        <Link
                                            href={route(
                                                'products.show',
                                                product.slug
                                            )}
                                        >
                                            <div className="aspect-square overflow-hidden bg-muted">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-16 w-16 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <CardContent className="space-y-4 p-4">
                                            {/* Catégorie */}
                                            {product.category && (
                                                <Badge variant="secondary">
                                                    {
                                                        product
                                                            .category
                                                            .name
                                                    }
                                                </Badge>
                                            )}

                                            {/* Nom */}
                                            <Link
                                                href={route(
                                                    'products.show',
                                                    product.slug
                                                )}
                                            >
                                                <h2 className="line-clamp-2 text-lg font-semibold hover:underline">
                                                    {product.name}
                                                </h2>
                                            </Link>

                                            {/* Prix */}
                                            <p className="text-lg font-bold">
                                                {Number(
                                                    product.price
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}{' '}
                                                FCFA
                                            </p>

                                            {/* Stock */}
                                            {product.stock > 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    {product.stock}{' '}
                                                    {product.stock > 1
                                                        ? 'unités disponibles'
                                                        : 'unité disponible'}
                                                </p>
                                            ) : (
                                                <p className="text-sm font-medium text-destructive">
                                                    Rupture de stock
                                                </p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    className="flex-1"
                                                >
                                                    <Link
                                                        href={route(
                                                            'products.show',
                                                            product.slug
                                                        )}
                                                    >
                                                        Voir le produit
                                                    </Link>
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeFavorite(
                                                            product.id
                                                        )
                                                    }
                                                    title="Retirer des favoris"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {favorites.links &&
                            favorites.links.length > 3 && (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {favorites.links.map(
                                        (link, index) => (
                                            <Button
                                                key={index}
                                                asChild
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                            >
                                                <Link
                                                    href={
                                                        link.url ||
                                                        '#'
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            link.label,
                                                    }}
                                                />
                                            </Button>
                                        )
                                    )}
                                </div>
                            )}
                    </>
                )}
            </div>
        </>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
