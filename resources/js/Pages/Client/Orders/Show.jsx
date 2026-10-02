import { Head, Link, router } from '@inertiajs/react'
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    MapPin,
    Package,
    Phone,
    User,
} from 'lucide-react'

import AppLayout from '@/layouts/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    assigned: 'Livreur affecté',
    out_for_delivery: 'En cours de livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée',
}

const statusVariants = {
    pending: 'secondary',
    confirmed: 'default',
    preparing: 'default',
    ready: 'default',
    assigned: 'secondary',
    out_for_delivery: 'default',
    delivered: 'default',
    cancelled: 'destructive',
}

const paymentMethodLabels = {
    cash_on_delivery: 'Paiement à la livraison',
}

const paymentStatusLabels = {
    pending: 'En attente',
    paid: 'Payé',
    failed: 'Échec',
}

const paymentStatusVariants = {
    pending: 'secondary',
    paid: 'default',
    failed: 'destructive',
}

export default function Show({ order }) {
    const handleCancel = () => {
        const confirmed = window.confirm(
            'Êtes-vous sûr de vouloir annuler cette commande ?'
        )

        if (!confirmed) {
            return
        }

        router.patch(route('client.orders.cancel', order.id))
    }

    return (
        <AppLayout>
            <Head title={`Commande #${order.id}`} />

            <div className="container mx-auto space-y-6 px-4 py-6">
                {/* En-tête */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('client.orders.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Commande #{order.id}
                            </h1>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />

                                <span>
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={
                                statusVariants[order.status] || 'secondary'
                            }
                        >
                            {statusLabels[order.status] || order.status}
                        </Badge>

                        {order.status === 'pending' && (
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                            >
                                Annuler la commande
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Contenu principal */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Produits */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Produits commandés
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="divide-y">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                                {item.product?.image ? (
                                                    <img
                                                        src={`/storage/${item.product.image}`}
                                                        alt={
                                                            item.product.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium">
                                                    {item.product?.name ||
                                                        'Produit'}
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Quantité : {item.quantity}
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Prix unitaire :{' '}
                                                    {Number(
                                                        item.unit_price
                                                    ).toLocaleString('fr-FR')}{' '}
                                                    FCFA
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {Number(
                                                        item.total
                                                    ).toLocaleString('fr-FR')}{' '}
                                                    FCFA
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suivi de la commande */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Suivi de la commande
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {order.statusHistories?.length > 0 ? (
                                    <div className="space-y-0">
                                        {order.statusHistories.map(
                                            (history, index) => {
                                                const isLast =
                                                    index ===
                                                    order.statusHistories
                                                        .length -
                                                        1

                                                return (
                                                    <div
                                                        key={history.id}
                                                        className="relative flex gap-4"
                                                    >
                                                        {!isLast && (
                                                            <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                                                        )}

                                                        <div
                                                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                                history.status ===
                                                                order.status
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted text-muted-foreground'
                                                            }`}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>

                                                        <div className="pb-8">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                                <p className="font-semibold">
                                                                    {statusLabels[
                                                                        history
                                                                            .status
                                                                    ] ||
                                                                        history.status}
                                                                </p>

                                                                {history.status ===
                                                                    order.status && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="w-fit"
                                                                    >
                                                                        Statut
                                                                        actuel
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {history.comment && (
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    {
                                                                        history.comment
                                                                    }
                                                                </p>
                                                            )}

                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {new Date(
                                                                    history.created_at
                                                                ).toLocaleString(
                                                                    'fr-FR',
                                                                    {
                                                                        day: '2-digit',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }
                                                                )}
                                                            </p>

                                                            {history.changedBy
                                                                ?.name && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Modifié
                                                                    par :{' '}
                                                                    {
                                                                        history
                                                                            .changedBy
                                                                            .name
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Aucun historique disponible pour cette
                                        commande.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Adresse de livraison */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Adresse de livraison
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />

                                        <span className="font-medium">
                                            {order.delivery_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />

                                        <span>
                                            {order.delivery_phone}
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p>
                                            {order.delivery_city},{' '}
                                            {order.delivery_commune}
                                        </p>

                                        <p>
                                            {order.delivery_quartier}
                                        </p>

                                        <p>{order.delivery_address}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Livraison */}
                        {order.delivery && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Livraison
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Statut
                                            </span>

                                            <Badge variant="secondary">
                                                {order.delivery.status ===
                                                    'assigned' &&
                                                    'Livreur affecté'}

                                                {order.delivery.status ===
                                                    'picked_up' &&
                                                    'Colis récupéré'}

                                                {order.delivery.status ===
                                                    'out_for_delivery' &&
                                                    'En cours de livraison'}

                                                {order.delivery.status ===
                                                    'delivered' &&
                                                    'Livrée'}

                                                {order.delivery.status ===
                                                    'failed' &&
                                                    'Échec de livraison'}
                                            </Badge>
                                        </div>

                                        {order.delivery.driver && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Livreur
                                                    </span>

                                                    <span className="font-medium">
                                                        {
                                                            order.delivery
                                                                .driver.name
                                                        }
                                                    </span>
                                                </div>

                                                {order.delivery.driver
                                                    .phone && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            Téléphone
                                                        </span>

                                                        <span>
                                                            {
                                                                order.delivery
                                                                    .driver
                                                                    .phone
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {order.delivery.assigned_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Affectée le
                                                </span>

                                                <span className="text-sm">
                                                    {new Date(
                                                        order.delivery.assigned_at
                                                    ).toLocaleDateString(
                                                        'fr-FR'
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {order.delivery.delivered_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Livrée le
                                                </span>

                                                <span className="text-sm">
                                                    {new Date(
                                                        order.delivery.delivered_at
                                                    ).toLocaleDateString(
                                                        'fr-FR'
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {order.delivery.notes && (
                                            <div className="rounded-lg bg-muted p-3">
                                                <p className="text-sm font-medium">
                                                    Note du livreur
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {order.delivery.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Résumé */}
                    <div className="space-y-6">
                        {/* Paiement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Paiement
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Méthode
                                    </span>

                                    <span className="text-sm font-medium">
                                        {paymentMethodLabels[
                                            order.payment_method
                                        ] || order.payment_method}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Statut
                                    </span>

                                    <Badge
                                        variant={
                                            paymentStatusVariants[
                                                order.payment_status
                                            ] || 'secondary'
                                        }
                                    >
                                        {paymentStatusLabels[
                                            order.payment_status
                                        ] || order.payment_status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Résumé de la commande */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Résumé de la commande
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Sous-total
                                    </span>

                                    <span>
                                        {Number(
                                            order.subtotal
                                        ).toLocaleString('fr-FR')}{' '}
                                        FCFA
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Livraison
                                    </span>

                                    <span>
                                        {Number(
                                            order.delivery_fee
                                        ).toLocaleString('fr-FR')}{' '}
                                        FCFA
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold">
                                            {Number(
                                                order.total
                                            ).toLocaleString('fr-FR')}{' '}
                                            FCFA
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
