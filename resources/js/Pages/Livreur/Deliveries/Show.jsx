import { Head, Link, useForm } from '@inertiajs/react'

import {
    ArrowLeft,
    CheckCircle,
    Clock,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
    XCircle,
} from 'lucide-react'

import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Show({
    delivery,
    statusOptions,
}) {
    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm({
        status: '',
    })

    const submit = (event) => {
        event.preventDefault()

        if (!data.status) {
            return
        }

        patch(
            route(
                'livreur.deliveries.update-status',
                delivery.id
            ),
            {
                preserveScroll: true,
            }
        )
    }

    const getVariant = (status) => {
        if (status === 'delivered') {
            return 'default'
        }

        if (status === 'failed') {
            return 'destructive'
        }

        return 'secondary'
    }

    const getStatusIcon = (status) => {
        if (status === 'delivered') {
            return CheckCircle
        }

        if (status === 'failed') {
            return XCircle
        }

        if (status === 'out_for_delivery') {
            return Truck
        }

        if (status === 'picked_up') {
            return Package
        }

        return Clock
    }

    const StatusIcon = getStatusIcon(
        delivery.status
    )

    const isFinished =
        delivery.status === 'delivered' ||
        delivery.status === 'failed'

    const canUpdateStatus =
        delivery.status === 'assigned' ||
        delivery.status === 'picked_up' ||
        delivery.status === 'out_for_delivery'

    const getNextStatuses = () => {
        if (delivery.status === 'assigned') {
            return [
                {
                    value: 'picked_up',
                    label: 'Colis récupéré',
                },
                {
                    value: 'failed',
                    label: 'Échec de la livraison',
                },
            ]
        }

        if (delivery.status === 'picked_up') {
            return [
                {
                    value: 'out_for_delivery',
                    label: 'En cours de livraison',
                },
                {
                    value: 'failed',
                    label: 'Échec de la livraison',
                },
            ]
        }

        if (delivery.status === 'out_for_delivery') {
            return [
                {
                    value: 'delivered',
                    label: 'Commande livrée',
                },
                {
                    value: 'failed',
                    label: 'Échec de la livraison',
                },
            ]
        }

        return []
    }

    const nextStatuses = getNextStatuses()

    return (
        <>
            <Head
                title={`Livraison #${delivery.id}`}
            />

            <div className="min-h-screen bg-muted/30 p-6">

                <div className="mx-auto max-w-6xl">

                    {/* Retour */}

                    <div className="mb-6">

                        <Button
                            variant="outline"
                            asChild
                        >

                            <Link
                                href={route(
                                    'livreur.deliveries.index'
                                )}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour aux livraisons
                            </Link>

                        </Button>

                    </div>

                    {/* En-tête */}

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Livraison #{delivery.id}
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Commande #{delivery.order?.id}
                            </p>

                        </div>

                        <Badge
                            variant={getVariant(
                                delivery.status
                            )}
                            className="w-fit px-4 py-2 text-sm"
                        >
                            <StatusIcon className="mr-2 h-4 w-4" />

                            {statusOptions[
                                delivery.status
                            ] ?? delivery.status}
                        </Badge>

                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* Partie principale */}

                        <div className="space-y-6 lg:col-span-2">

                            {/* Client */}

                            <Card>

                                <CardHeader>

                                    <CardTitle className="flex items-center gap-2">

                                        <User className="h-5 w-5" />

                                        Client

                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-4">

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Nom
                                        </p>

                                        <p className="font-medium">
                                            {delivery.order?.delivery_name ??
                                                delivery.order?.user?.name ??
                                                'Non renseigné'}
                                        </p>

                                    </div>

                                    {delivery.order?.delivery_phone && (
                                        <div>

                                            <p className="text-sm text-muted-foreground">
                                                Téléphone
                                            </p>

                                            <a
                                                href={`tel:${delivery.order.delivery_phone}`}
                                                className="flex items-center gap-2 font-medium hover:underline"
                                            >
                                                <Phone className="h-4 w-4" />

                                                {
                                                    delivery.order
                                                        .delivery_phone
                                                }
                                            </a>

                                        </div>
                                    )}

                                </CardContent>

                            </Card>

                            {/* Adresse */}

                            <Card>

                                <CardHeader>

                                    <CardTitle className="flex items-center gap-2">

                                        <MapPin className="h-5 w-5" />

                                        Adresse de livraison

                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-2">

                                    <p>
                                        <span className="font-medium">
                                            Ville :
                                        </span>{' '}
                                        {delivery.order?.delivery_city ??
                                            'Non renseignée'}
                                    </p>

                                    <p>
                                        <span className="font-medium">
                                            Commune :
                                        </span>{' '}
                                        {delivery.order?.delivery_commune ??
                                            'Non renseignée'}
                                    </p>

                                    <p>
                                        <span className="font-medium">
                                            Quartier :
                                        </span>{' '}
                                        {delivery.order?.delivery_quartier ??
                                            'Non renseigné'}
                                    </p>

                                    <p>
                                        <span className="font-medium">
                                            Adresse :
                                        </span>{' '}
                                        {delivery.order?.delivery_address ??
                                            'Non renseignée'}
                                    </p>

                                </CardContent>

                            </Card>

                            {/* Produits */}

                            <Card>

                                <CardHeader>

                                    <CardTitle className="flex items-center gap-2">

                                        <Package className="h-5 w-5" />

                                        Produits de la commande

                                    </CardTitle>

                                </CardHeader>

                                <CardContent>

                                    {delivery.order?.items?.length > 0 ? (
                                        <div className="space-y-4">

                                            {delivery.order.items.map(
                                                (item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                                                    >

                                                        <div>

                                                            <p className="font-medium">
                                                                {item.product?.name ??
                                                                    'Produit supprimé'}
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                Quantité :{' '}
                                                                {
                                                                    item.quantity
                                                                }
                                                            </p>

                                                        </div>

                                                        <p className="whitespace-nowrap font-medium">

                                                            {Number(
                                                                item.total ?? 0
                                                            ).toLocaleString(
                                                                'fr-FR'
                                                            )}{' '}
                                                            FCFA

                                                        </p>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Aucun produit trouvé.
                                        </p>
                                    )}

                                </CardContent>

                            </Card>

                            {/* Résumé */}

                            <Card>

                                <CardHeader>

                                    <CardTitle>
                                        Résumé de la commande
                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-3">

                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Sous-total
                                        </span>

                                        <span>
                                            {Number(
                                                delivery.order?.subtotal ?? 0
                                            ).toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">
                                            Livraison
                                        </span>

                                        <span>
                                            {Number(
                                                delivery.order?.delivery_fee ?? 0
                                            ).toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>

                                    </div>

                                    <div className="flex justify-between border-t pt-3 text-lg font-bold">

                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            {Number(
                                                delivery.order?.total ?? 0
                                            ).toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>

                                    </div>

                                </CardContent>

                            </Card>

                        </div>

                        {/* Colonne statut */}

                        <div className="space-y-6">

                            <Card className="h-fit">

                                <CardHeader>

                                    <CardTitle>
                                        État de la livraison
                                    </CardTitle>

                                </CardHeader>

                                <CardContent>

                                    <div className="mb-6 flex items-center gap-3 rounded-lg border p-4">

                                        <StatusIcon className="h-6 w-6" />

                                        <div>

                                            <p className="text-sm text-muted-foreground">
                                                État actuel
                                            </p>

                                            <p className="font-semibold">
                                                {statusOptions[
                                                    delivery.status
                                                ] ?? delivery.status}
                                            </p>

                                        </div>

                                    </div>

                                    {isFinished ? (
                                        <div className="rounded-lg border p-4 text-sm text-muted-foreground">

                                            {delivery.status ===
                                            'delivered'
                                                ? 'Cette livraison est terminée. Aucune modification supplémentaire n’est nécessaire.'
                                                : 'Cette livraison a échoué. Aucune modification supplémentaire n’est possible.'}

                                        </div>
                                    ) : canUpdateStatus ? (
                                        <form
                                            onSubmit={submit}
                                            className="space-y-4"
                                        >

                                            <div>

                                                <label
                                                    htmlFor="status"
                                                    className="mb-2 block text-sm font-medium"
                                                >
                                                    Prochaine étape
                                                </label>

                                                <select
                                                    id="status"
                                                    value={
                                                        data.status
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            'status',
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-md border bg-background px-3 py-2"
                                                >

                                                    <option value="">
                                                        Sélectionner une action
                                                    </option>

                                                    {nextStatuses.map(
                                                        (status) => (
                                                            <option
                                                                key={
                                                                    status.value
                                                                }
                                                                value={
                                                                    status.value
                                                                }
                                                            >
                                                                {
                                                                    status.label
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>

                                            </div>

                                            {errors.status && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.status
                                                    }
                                                </p>
                                            )}

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={
                                                    processing ||
                                                    !data.status
                                                }
                                            >
                                                {processing
                                                    ? 'Mise à jour...'
                                                    : 'Mettre à jour'}
                                            </Button>

                                        </form>
                                    ) : null}

                                </CardContent>

                            </Card>

                            {/* Informations temporelles */}

                            <Card>

                                <CardHeader>

                                    <CardTitle>
                                        Informations
                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">

                                    {delivery.assigned_at && (
                                        <div>

                                            <p className="text-muted-foreground">
                                                Affectée le
                                            </p>

                                            <p className="font-medium">
                                                {new Date(
                                                    delivery.assigned_at
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}
                                            </p>

                                        </div>
                                    )}

                                    {delivery.picked_up_at && (
                                        <div>

                                            <p className="text-muted-foreground">
                                                Colis récupéré le
                                            </p>

                                            <p className="font-medium">
                                                {new Date(
                                                    delivery.picked_up_at
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}
                                            </p>

                                        </div>
                                    )}

                                    {delivery.delivered_at && (
                                        <div>

                                            <p className="text-muted-foreground">
                                                Livrée le
                                            </p>

                                            <p className="font-medium">
                                                {new Date(
                                                    delivery.delivered_at
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}
                                            </p>

                                        </div>
                                    )}

                                </CardContent>

                            </Card>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

Show.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
