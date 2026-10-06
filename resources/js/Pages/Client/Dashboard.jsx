import { Head, Link } from '@inertiajs/react'
import {
    ShoppingCart,
    Clock,
    CheckCircle,
    XCircle,
    Package,
} from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import AppLayout from '@/Layouts/AppLayout'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Dashboard({
    user,
    statistics,
    recentOrders,
}) {
    const statCards = [
        {
            title: 'Mes commandes',
            value: statistics.orders,
            icon: ShoppingCart,
        },
        {
            title: 'Commandes en cours',
            value: statistics.activeOrders,
            icon: Clock,
        },
        {
            title: 'Commandes livrées',
            value: statistics.deliveredOrders,
            icon: CheckCircle,
        },
        {
            title: 'Commandes annulées',
            value: statistics.cancelledOrders,
            icon: XCircle,
        },
    ]

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

    return (
        <>
            <Head title="Mon dashboard" />

            <div className="space-y-8 p-6">
                {}
                <div>
                    <h1 className="text-3xl font-bold">
                        Bonjour, {user.name} 👋
                    </h1>

                    <p className="text-muted-foreground">
                        Bienvenue dans votre espace client.
                    </p>
                </div>

                {}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon

                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>

                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>

                                <CardContent>
                                    <p className="text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Mes commandes récentes
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    Vous n'avez encore passé aucune commande
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Découvrez nos produits et passez votre
                                    première commande.
                                </p>

                                <Button asChild className="mt-4">
                                    <Link href={route('products.index')}>
                                        Voir les produits
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                Commande #{order.id}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString(
                                                    'fr-FR'
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {Number(
                                                        order.total
                                                    ).toLocaleString(
                                                        'fr-FR'
                                                    )}{' '}
                                                    FCFA
                                                </p>

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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Continuer mes achats
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="mb-4 text-muted-foreground">
                            Découvrez nos pomades, parfums et autres produits.
                        </p>

                        <Button asChild>
                            <Link href={route('products.index')}>
                                Voir le catalogue
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}


Dashboard.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
