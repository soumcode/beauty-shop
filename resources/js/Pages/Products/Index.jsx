import { Link } from '@inertiajs/react'
import PublicLayout from '@/layouts/PublicLayout'

import {
    Card,
    CardContent,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Index({
    products,
    categories,
    filters,
}) {
    return (
        <div className="min-h-screen bg-muted/30">

            {/* En-tête */}
            <div className="border-b bg-background">
                <div className="mx-auto max-w-7xl px-6 py-6">

                    <h1 className="text-3xl font-bold">
                        Nos produits
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Découvrez nos produits de beauté.
                    </p>

                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">

                {/* Recherche */}
                <Card className="mb-8">
                    <CardContent className="pt-6">

                        <form
                            method="GET"
                            action={route('products.index')}
                            className="flex flex-col gap-4 md:flex-row"
                        >

                            <Input
                                name="search"
                                placeholder="Rechercher un produit..."
                                defaultValue={
                                    filters.search ?? ''
                                }
                            />

                            <select
                                name="category"
                                defaultValue={
                                    filters.category ?? ''
                                }
                                className="h-10 rounded-md border bg-background px-3"
                            >
                                <option value="">
                                    Toutes les catégories
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>

                            <Button type="submit">
                                Rechercher
                            </Button>

                        </form>

                    </CardContent>
                </Card>

                {/* Produits */}
                {products.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {products.data.map(
                            (product) => (
                                <Card
                                    key={product.id}
                                    className="overflow-hidden transition hover:shadow-lg"
                                >

                                    {/* Image */}
                                    <div className="aspect-square bg-muted">

                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                Aucune image
                                            </div>
                                        )}

                                    </div>

                                    <CardContent className="p-5">

                                        <div className="mb-2 flex items-center justify-between gap-2">

                                            <Badge variant="secondary">
                                                {
                                                    product.category?.name
                                                }
                                            </Badge>

                                            {product.stock > 0 ? (
                                                <Badge>
                                                    En stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Rupture
                                                </Badge>
                                            )}

                                        </div>

                                        <h2 className="text-lg font-semibold">
                                            {product.name}
                                        </h2>

                                        <p className="mt-2 text-xl font-bold">
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </p>

                                        <Button
                                            asChild
                                            className="mt-4 w-full"
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

                                    </CardContent>

                                </Card>
                            )
                        )}

                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">

                            <h2 className="text-xl font-semibold">
                                Aucun produit trouvé
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                Essayez une autre recherche ou
                                une autre catégorie.
                            </p>

                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">

                    {products.links.map(
                        (link, index) => (
                            <Link
                                key={index}
                                href={
                                    link.url ?? '#'
                                }
                                className={`rounded-md border px-3 py-2 text-sm ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        )
                    )}

                </div>

            </div>
        </div>
    )
}


Index.layout = (page) => (
    <PublicLayout>
        {page}
    </PublicLayout>
)
