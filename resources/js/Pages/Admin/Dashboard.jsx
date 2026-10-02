import { Head } from '@inertiajs/react'
import {
    Package,
    ShoppingCart,
    Users,
    Truck,
    Clock,
    ChefHat,
    Bike,
    CheckCircle,
} from 'lucide-react'

import AppLayout from '@/Layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default function Dashboard({ statistics, recentOrders }) {
    const statCards = [
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

    const orderStats = [
        {
            title: 'En attente',
            value: statistics.pendingOrders,
            icon: Clock,
        },
        {
            title: 'En préparation',
            value: statistics.preparingOrders,
            icon: ChefHat,
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
    ]

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="space-y-8 p-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard Admin
                    </h1>

                    <p className="text-muted-foreground">
                        Bienvenue dans votre espace d'administration.
                    </p>
                </div>

                {/* Statistiques principales */}
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
                                    <div className="text-3xl font-bold">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Statistiques des commandes */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">
                        État des commandes
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        <CardTitle>
                            Commandes récentes
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-muted-foreground">
                                Aucune commande pour le moment.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                Commande #{order.id}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {order.user?.name}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium">
                                                {Number(order.total).toLocaleString(
                                                    'fr-FR'
                                                )}{' '}
                                                FCFA
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
