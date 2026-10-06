import { Head, Link } from '@inertiajs/react'
import {
    CalendarDays,
    CreditCard,
    Package,
    ShoppingBag,
} from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import AppLayout from '@/layouts/AppLayout'

export default function Index({ orders }) {
    const statusLabels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        preparing: 'En préparation',
        ready: 'Prête',
        assigned: 'Livreur affecté',
        out_for_delivery: 'En livraison',
        delivered: 'Livrée',
        cancelled: 'Annulée',
    }

    const statusVariants = {
        pending: 'secondary',
        confirmed: 'default',
        preparing: 'secondary',
        ready: 'default',
        assigned: 'default',
        out_for_delivery: 'default',
        delivered: 'default',
        cancelled: 'destructive',
    }

    const paymentMethodLabels = {
        cash_on_delivery: 'Paiement à la livraison',
    }

    return (
        <>
            <Head title="Mes commandes" />

            <div className="space-y-8 p-6">
                {}
                <div>
                    <h1 className="text-3xl font-bold">
                        Mes commandes
                    </h1>

                    <p className="text-muted-foreground">
                        Consultez l'historique et le suivi de vos commandes.
                    </p>
                </div>

                {}
                {orders.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h2 className="text-xl font-semibold">
                                Vous n'avez aucune commande
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                Commencez vos achats pour retrouver vos
                                commandes ici.
                            </p>

                            <Button asChild className="mt-6">
                                <Link href={route('products.index')}>
                                    Voir les produits
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {}
                        <div className="space-y-4">
                            {orders.data.map((order) => {
                                const itemsCount =
                                    order.items_count ??
                                    order.items?.reduce(
                                        (total, item) =>
                                            total + Number(item.quantity),
                                        0
                                    ) ??
                                    0

                                return (
                                    <Card key={order.id}>
                                        <CardHeader>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <CardTitle>
                                                        Commande #{order.id}
                                                    </CardTitle>

                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-2">
                                                            <CalendarDays className="h-4 w-4" />

                                                            {new Date(
                                                                order.created_at
                                                            ).toLocaleDateString(
                                                                'fr-FR',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                }
                                                            )}
                                                        </span>

                                                        <span className="text-muted-foreground">
                                                            •
                                                        </span>

                                                        <span className="flex items-center gap-2">
                                                            <Package className="h-4 w-4" />

                                                            {itemsCount}{' '}
                                                            {itemsCount > 1
                                                                ? 'articles'
                                                                : 'article'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            order.status
                                                        ] || 'secondary'
                                                    }
                                                >
                                                    {statusLabels[
                                                        order.status
                                                    ] || order.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Total
                                                        </p>

                                                        <p className="font-semibold">
                                                            {Number(
                                                                order.total
                                                            ).toLocaleString(
                                                                'fr-FR'
                                                            )}{' '}
                                                            FCFA
                                                        </p>
                                                    </div>
                                                </div>

                                                {}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Paiement
                                                        </p>

                                                        <p className="font-medium">
                                                            {paymentMethodLabels[
                                                                order
                                                                    .payment_method
                                                            ] ||
                                                                order.payment_method}
                                                        </p>
                                                    </div>
                                                </div>

                                                {}
                                                <div className="flex items-center sm:justify-end">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <Link
                                                            href={route(
                                                                'client.orders.show',
                                                                order.id
                                                            )}
                                                        >
                                                            Voir la commande
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {}
                        {orders.links &&
                            orders.links.length > 3 && (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {orders.links.map((link, index) => (
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
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Button>
                                    ))}
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
