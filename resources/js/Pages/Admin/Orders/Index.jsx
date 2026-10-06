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
    orders,
    filters,
    statusOptions,
}) {
    const {
        data,
        setData,
        get,
        processing,
    } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    })

    const submitSearch = (e) => {
        e.preventDefault()

        get(route('admin.orders.index'), {
            preserveState: true,
            replace: true,
        })
    }

    const getStatusVariant = (status) => {
        if (status === 'delivered') {
            return 'default'
        }

        if (status === 'cancelled') {
            return 'destructive'
        }

        if (status === 'pending') {
            return 'outline'
        }

        return 'secondary'
    }

    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-7xl">

                {}
                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Commandes
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Gérez les commandes de votre boutique.
                    </p>

                </div>

                {}
                <Card className="mb-6">

                    <CardContent className="pt-6">

                        <form
                            onSubmit={submitSearch}
                            className="grid gap-4 md:grid-cols-3"
                        >

                            <Input
                                placeholder="Nom du client ou numéro..."
                                value={data.search}
                                onChange={(e) =>
                                    setData(
                                        'search',
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value
                                    )
                                }
                                className="h-10 rounded-md border bg-background px-3"
                            >

                                <option value="">
                                    Tous les statuts
                                </option>

                                {Object.entries(
                                    statusOptions
                                ).map(
                                    ([
                                        value,
                                        label,
                                    ]) => (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {label}
                                        </option>
                                    )
                                )}

                            </select>

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                Rechercher
                            </Button>

                        </form>

                    </CardContent>

                </Card>

                {}
                <Card>

                    <CardHeader>

                        <CardTitle>
                            Liste des commandes
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b text-left">

                                        <th className="p-3">
                                            Commande
                                        </th>

                                        <th className="p-3">
                                            Client
                                        </th>

                                        <th className="p-3">
                                            Total
                                        </th>

                                        <th className="p-3">
                                            Statut
                                        </th>

                                        <th className="p-3">
                                            Date
                                        </th>

                                        <th className="p-3">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {orders.data.length > 0 ? (
                                        orders.data.map(
                                            (order) => (
                                                <tr
                                                    key={
                                                        order.id
                                                    }
                                                    className="border-b"
                                                >

                                                    <td className="p-3 font-medium">
                                                        #
                                                        {
                                                            order.id
                                                        }
                                                    </td>

                                                    <td className="p-3">
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    order
                                                                        .user
                                                                        ?.name
                                                                }
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    order
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="p-3">
                                                        {Number(
                                                            order.total
                                                        ).toLocaleString(
                                                            'fr-FR'
                                                        )}{' '}
                                                        FCFA
                                                    </td>

                                                    <td className="p-3">

                                                        <Badge
                                                            variant={getStatusVariant(
                                                                order.status
                                                            )}
                                                        >
                                                            {
                                                                statusOptions[
                                                                    order
                                                                        .status
                                                                ]
                                                            }
                                                        </Badge>

                                                    </td>

                                                    <td className="p-3">
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString(
                                                            'fr-FR'
                                                        )}
                                                    </td>

                                                    <td className="p-3">

                                                        <Button
                                                            variant="outline"
                                                            asChild
                                                        >

                                                            <Link
                                                                href={route(
                                                                    'admin.orders.show',
                                                                    order.id
                                                                )}
                                                            >
                                                                Voir
                                                            </Link>

                                                        </Button>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="p-8 text-center text-muted-foreground"
                                            >
                                                Aucune commande
                                                trouvée.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {}
                        <div className="mt-6 flex flex-wrap gap-2">

                            {orders.links.map(
                                (link, index) => (
                                    <Link
                                        key={index}
                                        href={
                                            link.url ??
                                            '#'
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

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}


Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
