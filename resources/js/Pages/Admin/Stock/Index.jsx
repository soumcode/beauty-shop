import { Head, Link } from '@inertiajs/react'

import {
    AlertTriangle,
    CheckCircle,
    Package,
    PackageX,
} from 'lucide-react'

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
    statistics,
    filters,
}) {
    const getStockStatus = (stock) => {
        const value = Number(stock)

        if (value === 0) {
            return {
                label: 'Rupture',
                variant: 'destructive',
            }
        }

        if (value <= 5) {
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
        <>
            <Head title="Gestion du stock" />

            <div className="min-h-screen bg-muted/30 p-6">

                <div className="mx-auto max-w-7xl">

                    {/* En-tête */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">
                            Gestion du stock
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Surveillez les stocks de vos produits.
                        </p>

                    </div>

                    {/* Statistiques */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Produits
                                </CardTitle>

                                <Package className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {
                                        statistics.totalProducts
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Unités disponibles
                                </CardTitle>

                                <Package className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {
                                        statistics.totalUnits
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Disponibles
                                </CardTitle>

                                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {
                                        statistics.availableProducts
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Stock faible
                                </CardTitle>

                                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {
                                        statistics.lowStock
                                    }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Ruptures
                                </CardTitle>

                                <PackageX className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {
                                        statistics.outOfStock
                                    }
                                </p>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Recherche */}

                    <Card className="mt-8">

                        <CardContent className="pt-6">

                            <form
                                method="GET"
                                action={route(
                                    'admin.stock.index'
                                )}
                                className="flex flex-col gap-3 sm:flex-row"
                            >

                                <Input
                                    name="search"
                                    placeholder="Rechercher un produit..."
                                    defaultValue={
                                        filters.search ??
                                        ''
                                    }
                                />

                                <Button type="submit">
                                    Rechercher
                                </Button>

                            </form>

                        </CardContent>

                    </Card>

                    {/* Liste */}

                    <Card className="mt-6">

                        <CardHeader>

                            <CardTitle>
                                État des stocks
                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            {products.data.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    Aucun produit trouvé.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b text-left">

                                                <th className="p-3">
                                                    Produit
                                                </th>

                                                <th className="p-3">
                                                    Catégorie
                                                </th>

                                                <th className="p-3">
                                                    Stock
                                                </th>

                                                <th className="p-3">
                                                    État
                                                </th>

                                                <th className="p-3">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {products.data.map(
                                                (product) => {
                                                    const stock =
                                                        Number(
                                                            product.stock
                                                        )

                                                    const status =
                                                        getStockStatus(
                                                            stock
                                                        )

                                                    return (
                                                        <tr
                                                            key={
                                                                product.id
                                                            }
                                                            className="border-b"
                                                        >

                                                            <td className="p-3">

                                                                <div className="flex items-center gap-3">

                                                                    {product.image ? (
                                                                        <img
                                                                            src={`/storage/${product.image}`}
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            className="h-12 w-12 rounded-md object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                                                            <Package className="h-5 w-5 text-muted-foreground" />
                                                                        </div>
                                                                    )}

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

                                                                </div>

                                                            </td>

                                                            <td className="p-3">

                                                                {product.category?.name ??
                                                                    'Sans catégorie'}

                                                            </td>

                                                            <td className="p-3">

                                                                <span className="font-bold">
                                                                    {
                                                                        stock
                                                                    }
                                                                </span>

                                                                {' '}
                                                                unité
                                                                {stock >
                                                                1
                                                                    ? 's'
                                                                    : ''}

                                                            </td>

                                                            <td className="p-3">

                                                                <Badge
                                                                    variant={
                                                                        status.variant
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </Badge>

                                                            </td>

                                                            <td className="p-3">

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
                                                                        Modifier le stock
                                                                    </Link>

                                                                </Button>

                                                            </td>

                                                        </tr>
                                                    )
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                            {/* Pagination */}

                            {products.links?.length > 0 && (
                                <div className="mt-6 flex flex-wrap justify-center gap-2">

                                    {products.links.map(
                                        (
                                            link,
                                            index
                                        ) => (
                                            <Link
                                                key={
                                                    index
                                                }
                                                href={
                                                    link.url ??
                                                    '#'
                                                }
                                                className={`rounded-md border px-3 py-2 text-sm ${
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

            </div>
        </>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
