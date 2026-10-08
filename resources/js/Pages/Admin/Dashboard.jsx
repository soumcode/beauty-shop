import { Head, Link } from '@inertiajs/react'

import {
    AlertTriangle,
    Bike,
    CheckCircle,
    ChefHat,
    Clock,
    Package,
    PackageCheck,
    PackageX,
    ShoppingCart,
    Truck,
    Users,
    XCircle,
} from 'lucide-react'

import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Dashboard({
    statistics,
    recentOrders,
}) {
    const generalStats = [
        {
            title: 'Produits',
            value: statistics.products,
            icon: Package,
        },
        {
            title: 'Clients',
            value: statistics.clients,
            icon: Users,
        },
        {
            title: 'Commandes',
            value: statistics.orders,
            icon: ShoppingCart,
        },
        {
            title: 'Livreurs',
            value: statistics.drivers,
            icon: Truck,
        },
    ]

    const stockStats = [
        {
            title: 'Unités en stock',
            value: statistics.totalUnitsInStock,
            icon: PackageCheck,
        },
        {
            title: 'Stock faible',
            value: statistics.lowStockProducts,
            icon: AlertTriangle,
        },
        {
            title: 'Ruptures',
            value: statistics.outOfStockProducts,
            icon: PackageX,
        },
    ]

    const orderStats = [
        {
            title: 'En attente',
            value: statistics.pendingOrders,
            icon: Clock,
        },
        {
            title: 'Confirmées',
            value: statistics.confirmedOrders,
            icon: CheckCircle,
        },
        {
            title: 'En préparation',
            value: statistics.preparingOrders,
            icon: ChefHat,
        },
        {
            title: 'Prêtes',
            value: statistics.readyOrders,
            icon: PackageCheck,
        },
        {
            title: 'Livreur affecté',
            value: statistics.assignedOrders,
            icon: Truck,
        },
        {
            title: 'En livraison',
            value: statistics.outForDeliveryOrders,
            icon: Bike,
        },
        {
            title: 'Livrées',
            value: statistics.deliveredOrders,
            icon: CheckCircle,
        },
        {
            title: 'Annulées',
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
            <Head title="Dashboard Admin" />

            <div className="space-y-8 p-6">

                {/* En-tête */}

                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard Admin
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Vue d'ensemble de votre boutique.
                    </p>
                </div>

                {/* Statistiques générales */}

                <div>
                    <h2 className="mb-4 text-xl font-semibold">
                        Vue générale
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {generalStats.map((stat) => {
                            const Icon = stat.icon

                            return (
                                <Card key={stat.title}>

                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">

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
                </div>

                {/* Stock */}

                <div>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-semibold">
                                État du stock
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Surveillez les produits disponibles et les
                                ruptures.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            asChild
                        >
                            <Link
                                href={route(
                                    'admin.stock.index'
                                )}
                            >
                                Gérer le stock
                            </Link>
                        </Button>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">

                        {stockStats.map((stat) => {
                            const Icon = stat.icon

                            return (
                                <Card key={stat.title}>

                                    <CardContent className="flex items-center gap-4 p-6">

                                        <Icon className="h-7 w-7 text-muted-foreground" />

                                        <div>

                                            <p className="text-sm text-muted-foreground">
                                                {stat.title}
                                            </p>

                                            <p className="text-2xl font-bold">
                                                {stat.value}
                                            </p>

                                        </div>

                                    </CardContent>

                                </Card>
                            )
                        })}

                    </div>
                </div>

                {/* Montant des commandes livrées */}

                <Card>

                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Montant des commandes livrées
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                                {Number(
                                    statistics.deliveredAmount
                                ).toLocaleString(
                                    'fr-FR'
                                )}{' '}
                                FCFA
                            </p>

                        </div>

                        <CheckCircle className="h-10 w-10 text-muted-foreground" />

                    </CardContent>

                </Card>

                {/* État des commandes */}

                <div>

                    <h2 className="mb-4 text-xl font-semibold">
                        État des commandes
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {orderStats.map((stat) => {
                            const Icon = stat.icon

                            return (
                                <Card key={stat.title}>

                                    <CardContent className="flex items-center gap-4 p-6">

                                        <Icon className="h-6 w-6 text-muted-foreground" />

                                        <div>

                                            <p className="text-sm text-muted-foreground">
                                                {stat.title}
                                            </p>

                                            <p className="text-2xl font-bold">
                                                {stat.value}
                                            </p>

                                        </div>

                                    </CardContent>

                                </Card>
                            )
                        })}

                    </div>

                </div>

                {/* Commandes récentes */}

                <Card>

                    <CardHeader>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <CardTitle>
                                    Commandes récentes
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Les dernières commandes enregistrées.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'admin.orders.index'
                                    )}
                                >
                                    Voir toutes les commandes
                                </Link>
                            </Button>

                        </div>

                    </CardHeader>

                    <CardContent>

                        {recentOrders.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">
                                Aucune commande pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {recentOrders.map(
                                    (order) => (
                                        <div
                                            key={order.id}
                                            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div>

                                                <p className="font-medium">
                                                    Commande #{order.id}
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Client :{' '}
                                                    {order.user?.name ??
                                                        'Client'}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
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
                                                </p>

                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            order.status
                                                        ] ??
                                                        'secondary'
                                                    }
                                                >
                                                    {statusLabels[
                                                        order.status
                                                    ] ??
                                                        order.status}
                                                </Badge>

                                                <p className="font-medium">

                                                    {Number(
                                                        order.total
                                                    ).toLocaleString(
                                                        'fr-FR'
                                                    )}{' '}
                                                    FCFA

                                                </p>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
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

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

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
