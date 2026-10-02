import { Head, Link } from '@inertiajs/react'
import {
    Truck,
    Clock,
    PackageCheck,
    CheckCircle,
    XCircle,
} from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AppLayout from '@/Layouts/AppLayout'

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
                        Bonjour, {user.name} 👋
                    </h1>

                    <p className="text-muted-foreground">
                        Bienvenue dans votre espace livreur.
                    </p>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                {/* Livraisons récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Mes dernières livraisons
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {recentDeliveries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Truck className="mb-4 h-12 w-12 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    Aucune livraison
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Vous n'avez actuellement aucune livraison
                                    assignée.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentDeliveries.map((delivery) => (
                                    <div
                                        key={delivery.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                Commande #{delivery.order.id}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                Client :{' '}
                                                {delivery.order.user?.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Badge
                                                variant={
                                                    statusVariants[
                                                        delivery.status
                                                    ] || 'secondary'
                                                }
                                            >
                                                {statusLabels[
                                                    delivery.status
                                                ] || delivery.status}
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
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bouton vers toutes les livraisons */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Gestion des livraisons
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="mb-4 text-muted-foreground">
                            Consultez toutes les commandes qui vous ont été
                            attribuées.
                        </p>

                        <Button asChild>
                            <Link href={route('livreur.deliveries.index')}>
                                Voir mes livraisons
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
