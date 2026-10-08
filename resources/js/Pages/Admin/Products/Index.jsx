import { Link, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Index({
    products,
    filters,
}) {
    const {
        data,
        setData,
        get,
        delete: destroy,
        processing,
    } = useForm({
        search: filters.search ?? '',
    })

    const search = (e) => {
        e.preventDefault()

        get(route('admin.products.index'), {
            preserveState: true,
            replace: true,
        })
    }

    const handleDelete = (id) => {
        if (
            !confirm(
                'Voulez-vous vraiment supprimer ce produit ?'
            )
        ) {
            return
        }

        destroy(
            route(
                'admin.products.destroy',
                id
            )
        )
    }

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return {
                label: 'Rupture',
                variant: 'destructive',
            }
        }

        if (stock <= 5) {
            return {
                label: 'Stock faible',
                variant: 'secondary',
            }
        }

        return {
            label: 'Disponible',
            variant: 'default',
        }
    }

    return (
        <div className="p-6">

            {/* En-tête */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold">
                        Produits
                    </h1>

                    <p className="mt-1 text-muted-foreground">
                        Gérez les produits et leur stock.
                    </p>
                </div>

                <Button asChild>
                    <Link
                        href={route(
                            'admin.products.create'
                        )}
                    >
                        Ajouter un produit
                    </Link>
                </Button>

            </div>

            {/* Recherche */}

            <Card className="mb-6">

                <CardContent className="pt-6">

                    <form
                        onSubmit={search}
                        className="flex flex-col gap-3 sm:flex-row"
                    >

                        <Input
                            placeholder="Rechercher un produit..."
                            value={data.search}
                            onChange={(e) =>
                                setData(
                                    'search',
                                    e.target.value
                                )
                            }
                        />

                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Recherche...'
                                : 'Rechercher'}
                        </Button>

                    </form>

                </CardContent>

            </Card>

            {/* Liste des produits */}

            <Card>

                <CardHeader>

                    <CardTitle>
                        Liste des produits
                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b text-left">

                                    <th className="p-3">
                                        Image
                                    </th>

                                    <th className="p-3">
                                        Produit
                                    </th>

                                    <th className="p-3">
                                        Catégorie
                                    </th>

                                    <th className="p-3">
                                        Prix
                                    </th>

                                    <th className="p-3">
                                        Stock
                                    </th>

                                    <th className="p-3">
                                        Statut
                                    </th>

                                    <th className="p-3">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {products.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-8 text-center text-muted-foreground"
                                        >
                                            Aucun produit trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map(
                                        (product) => {
                                            const stockStatus =
                                                getStockStatus(
                                                    Number(
                                                        product.stock
                                                    )
                                                )

                                            return (
                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                    className="border-b"
                                                >

                                                    {/* Image */}

                                                    <td className="p-3">

                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-16 w-16 rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                Aucune image
                                                            </span>
                                                        )}

                                                    </td>

                                                    {/* Produit */}

                                                    <td className="p-3">

                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    product.name
                                                                }
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                #{product.id}
                                                            </p>
                                                        </div>

                                                    </td>

                                                    {/* Catégorie */}

                                                    <td className="p-3">

                                                        {product.category?.name ??
                                                            'Sans catégorie'}

                                                    </td>

                                                    {/* Prix */}

                                                    <td className="p-3">

                                                        {Number(
                                                            product.price
                                                        ).toLocaleString(
                                                            'fr-FR'
                                                        )}{' '}
                                                        FCFA

                                                    </td>

                                                    {/* Stock */}

                                                    <td className="p-3">

                                                        <div className="space-y-1">

                                                            <p className="font-semibold">
                                                                {
                                                                    product.stock
                                                                }{' '}
                                                                unité
                                                                {Number(
                                                                    product.stock
                                                                ) >
                                                                1
                                                                    ? 's'
                                                                    : ''}
                                                            </p>

                                                            <Badge
                                                                variant={
                                                                    stockStatus.variant
                                                                }
                                                            >
                                                                {
                                                                    stockStatus.label
                                                                }
                                                            </Badge>

                                                        </div>

                                                    </td>

                                                    {/* Statut produit */}

                                                    <td className="p-3">

                                                        <Badge
                                                            variant={
                                                                product.status ===
                                                                'active'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {product.status ===
                                                            'active'
                                                                ? 'Actif'
                                                                : 'Inactif'}
                                                        </Badge>

                                                    </td>

                                                    {/* Actions */}

                                                    <td className="p-3">

                                                        <div className="flex flex-wrap gap-2">

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'admin.products.edit',
                                                                        product.id
                                                                    )}
                                                                >
                                                                    Modifier
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Supprimer
                                                            </Button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        }
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}

                    {products.links?.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">

                            {products.links.map(
                                (link, index) => (
                                    <Link
                                        key={index}
                                        href={
                                            link.url ?? '#'
                                        }
                                        className={`rounded border px-3 py-2 text-sm ${
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : 'hover:bg-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}

                        </div>
                    )}

                </CardContent>

            </Card>

        </div>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
