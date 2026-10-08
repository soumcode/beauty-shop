import { Head, Link } from '@inertiajs/react'

import {
    Truck,
    Clock,
    PackageCheck,
    CheckCircle,
    XCircle,
    ArrowRight,
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

export default function Dashboard({
    user,
    statistics,
    recentDeliveries,
}) {
    const statCards = [
        {
            title: 'Total des livraisons',
            value: statistics.totalDeliveries,
            icon: Truck,
        },
        {
            title: 'Livraisons assignées',
            value: statistics.assignedDeliveries,
            icon: Clock,
        },
        {
            title: 'Livraisons en cours',
            value: statistics.inProgressDeliveries,
            icon: PackageCheck,
        },
        {
            title: 'Livraisons terminées',
            value: statistics.deliveredDeliveries,
            icon: CheckCircle,
        },
        {
            title: 'Livraisons échouées',
            value: statistics.failedDeliveries,
            icon: XCircle,
        },
    ]

    const statusLabels = {
        assigned: 'Assignée',
        picked_up: 'Colis récupéré',
        out_for_delivery: 'En livraison',
        delivered: 'Livrée',
        failed: 'Échouée',
    }

    const statusVariants = {
        assigned: 'secondary',
        picked_up: 'default',
        out_for_delivery: 'default',
        delivered: 'default',
        failed: 'destructive',
    }

    return (
        <>
            <Head title="Dashboard Livreur" />

            <div className="space-y-8 p-6">

                {/* En-tête */}

                <div>
                    <h1 className="text-3xl font-bold">
                        Bonjour, {user?.name} 👋
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Bienvenue dans votre espace livreur.
                    </p>
                </div>

                {/* Statistiques */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                    {statCards.map((stat) => {
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

                {/* Dernières livraisons */}

                <Card>

                    <CardHeader>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <CardTitle>
                                    Mes dernières livraisons
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Les dernières commandes qui vous ont été
                                    attribuées.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'livreur.deliveries.index'
                                    )}
                                >
                                    Toutes les livraisons
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>

                        </div>

                    </CardHeader>

                    <CardContent>

                        {recentDeliveries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">

                                <Truck className="mb-4 h-12 w-12 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    Aucune livraison
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Vous n'avez actuellement aucune livraison
                                    assignée.
                                </p>

                            </div>
                        ) : (
                            <div className="space-y-4">

                                {recentDeliveries.map((delivery) => {

                                    const status =
                                        delivery.status

                                    return (
                                        <div
                                            key={delivery.id}
                                            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div className="space-y-1">

                                                <p className="font-semibold">
                                                    Commande #{delivery.order?.id}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    Client :{' '}
                                                    {delivery.order?.user?.name ??
                                                        delivery.order?.delivery_name ??
                                                        'Client'}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {delivery.order?.delivery_commune ??
                                                        'Commune non renseignée'}
                                                    {' - '}
                                                    {delivery.order?.delivery_quartier ??
                                                        'Quartier non renseigné'}
                                                </p>

                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">

                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            status
                                                        ] ?? 'secondary'
                                                    }
                                                >
                                                    {statusLabels[
                                                        status
                                                    ] ?? status}
                                                </Badge>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={route(
                                                            'livreur.deliveries.show',
                                                            delivery.id
                                                        )}
                                                    >
                                                        Voir
                                                    </Link>
                                                </Button>

                                            </div>

                                        </div>
                                    )
                                })}

                            </div>
                        )}

                    </CardContent>

                </Card>

                {/* Gestion des livraisons */}

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Gestion des livraisons
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <p className="mb-4 text-muted-foreground">
                            Consultez toutes les commandes qui vous ont été
                            attribuées et mettez à jour leur état.
                        </p>

                        <Button asChild>

                            <Link
                                href={route(
                                    'livreur.deliveries.index'
                                )}
                            >
                                Voir mes livraisons
                                <ArrowRight className="ml-2 h-4 w-4" />
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
