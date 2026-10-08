import { useEffect } from 'react'
import { Link, useForm } from '@inertiajs/react'
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
    order,
    statusOptions,
    nextStatusOptions,
    availableDrivers,
}) {
    
    const {
        data: statusData,
        setData: setStatusData,
        patch,
        processing: statusProcessing,
        errors: statusErrors,
    } = useForm({
        status: nextStatusOptions[0] ?? order.status,
    })

    useEffect(() => {
        setStatusData(
            'status',
            nextStatusOptions[0] ?? order.status
        )
    }, [order.id, order.status, nextStatusOptions[0]])

    
    const {
        data: driverData,
        setData: setDriverData,
        post,
        processing: driverProcessing,
        errors: driverErrors,
    } = useForm({
        driver_id: '',
    })

    const submitStatus = (e) => {
        e.preventDefault()

        patch(
            route(
                'admin.orders.update-status',
                order.id
            )
        )
    }

    const submitDriver = (e) => {
        e.preventDefault()

        post(
            route(
                'admin.orders.assign-driver',
                order.id
            )
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-6xl">

                {}
                <div className="mb-6">

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link
                            href={route(
                                'admin.orders.index'
                            )}
                        >
                            ← Retour aux commandes
                        </Link>
                    </Button>

                </div>

                {}
                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Commande #{order.id}
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Détails et gestion de la commande.
                    </p>

                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {}
                    <div className="space-y-6 lg:col-span-2">

                        {}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Informations client
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">

                                <p>
                                    <span className="font-medium">
                                        Nom :
                                    </span>{' '}
                                    {
                                        order.user?.name
                                    }
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Email :
                                    </span>{' '}
                                    {
                                        order.user?.email
                                    }
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Téléphone :
                                    </span>{' '}
                                    {
                                        order.delivery_phone
                                    }
                                </p>

                            </CardContent>

                        </Card>

                        {}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Produits commandés
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="space-y-4">

                                    {order.items.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-4 border-b pb-4"
                                            >

                                                <div className="flex items-center gap-4">

                                                    <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">

                                                        {item.product?.image ? (
                                                            <img
                                                                src={`/storage/${item.product.image}`}
                                                                alt={
                                                                    item
                                                                        .product
                                                                        .name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                                Pas d'image
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div>

                                                        <p className="font-medium">
                                                            {
                                                                item
                                                                    .product
                                                                    ?.name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-muted-foreground">
                                                            Quantité :{' '}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                        <p className="text-sm text-muted-foreground">
                                                            Prix unitaire :{' '}
                                                            {Number(
                                                                item.unit_price
                                                            ).toLocaleString(
                                                                'fr-FR'
                                                            )}{' '}
                                                            FCFA
                                                        </p>

                                                    </div>

                                                </div>

                                                <p className="font-semibold">

                                                    {Number(
                                                        item.total
                                                    ).toLocaleString(
                                                        'fr-FR'
                                                    )}{' '}
                                                    FCFA

                                                </p>

                                            </div>
                                        )
                                    )}

                                </div>

                            </CardContent>

                        </Card>

                        {}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Adresse de livraison
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-1">

                                <p>
                                    {
                                        order.delivery_name
                                    }
                                </p>

                                <p>
                                    {
                                        order.delivery_phone
                                    }
                                </p>

                                <p>
                                    {
                                        order.delivery_city
                                    }
                                </p>

                                <p>
                                    {
                                        order.delivery_commune
                                    }
                                </p>

                                <p>
                                    {
                                        order.delivery_quartier
                                    }
                                </p>

                                <p>
                                    {
                                        order.delivery_address
                                    }
                                </p>

                            </CardContent>

                        </Card>

                    </div>

                    {}
                    <div className="space-y-6">

                        {}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Statut
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <Badge
                                    variant={
                                        order.status ===
                                        'delivered'
                                            ? 'default'
                                            : order.status ===
                                                'cancelled'
                                              ? 'destructive'
                                              : order.status ===
                                                  'pending'
                                                ? 'outline'
                                                : 'secondary'
                                    }
                                    className="mb-6"
                                >
                                    {
                                        statusOptions[
                                            order.status
                                        ]
                                    }
                                </Badge>

                                {Object.keys(
                                    nextStatusOptions
                                ).length > 0 && (
                                    <form
                                        onSubmit={
                                            submitStatus
                                        }
                                        className="space-y-4"
                                    >

                                        <div>

                                            <label
                                                htmlFor="status"
                                                className="mb-2 block text-sm font-medium"
                                            >
                                                Modifier le statut
                                            </label>

                                            <select
                                                id="status"
                                                value={
                                                    statusData.status
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setStatusData(
                                                        'status',
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-md border bg-background px-3 py-2"
                                            >

                                                {nextStatusOptions.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {statusOptions[status]}
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>

                                        {statusErrors.status && (
                                            <p className="text-sm text-red-500">
                                                {
                                                    statusErrors.status
                                                }
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={
                                                statusProcessing
                                            }
                                        >
                                            {statusProcessing
                                                ? 'Mise à jour...'
                                                : 'Mettre à jour'}
                                        </Button>

                                    </form>
                                )}

                            </CardContent>

                        </Card>

                        {}
                        {!order.delivery && (
                                <Card>

                                    <CardHeader>
                                        <CardTitle>
                                            Affecter un livreur
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>

                                        {order.status !== 'ready' ? (
                                            <p className="text-sm text-muted-foreground">
                                                La commande doit être au statut « Prête » avant de pouvoir affecter un livreur.
                                            </p>
                                        ) : availableDrivers.length > 0 ? (
                                            <form
                                                onSubmit={
                                                    submitDriver
                                                }
                                                className="space-y-4"
                                            >

                                                <div>

                                                    <label
                                                        htmlFor="driver_id"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        Livreur
                                                    </label>

                                                    <select
                                                        id="driver_id"
                                                        value={
                                                            driverData.driver_id
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setDriverData(
                                                                'driver_id',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full rounded-md border bg-background px-3 py-2"
                                                    >

                                                        <option value="">
                                                            Sélectionner un livreur
                                                        </option>

                                                        {availableDrivers.map(
                                                            (
                                                                driver
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        driver.id
                                                                    }
                                                                    value={
                                                                        driver.id
                                                                    }
                                                                >
                                                                    {
                                                                        driver.name
                                                                    }
                                                                    {' - '}
                                                                    {
                                                                        driver.phone
                                                                    }
                                                                </option>
                                                            )
                                                        )}

                                                    </select>

                                                </div>

                                                {driverErrors.driver_id && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            driverErrors.driver_id
                                                        }
                                                    </p>
                                                )}

                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={
                                                        driverProcessing
                                                    }
                                                >
                                                    {driverProcessing
                                                        ? 'Affectation...'
                                                        : 'Affecter le livreur'}
                                                </Button>

                                            </form>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Aucun livreur
                                                disponible actuellement.
                                            </p>
                                        )}

                                    </CardContent>

                                </Card>
                            )}

                        {}
                        {order.delivery && (
                            <Card>

                                <CardHeader>
                                    <CardTitle>
                                        Livraison
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-3">

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Livreur
                                        </p>

                                        <p className="font-medium">
                                            {
                                                order.delivery
                                                    .driver
                                                    ?.name
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Téléphone
                                        </p>

                                        <p className="font-medium">
                                            {
                                                order.delivery
                                                    .driver
                                                    ?.phone
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            État
                                        </p>

                                        <Badge>
                                            {
                                                order.delivery
                                                    .status
                                            }
                                        </Badge>
                                    </div>

                                </CardContent>

                            </Card>
                        )}

                        {}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Résumé
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div className="flex justify-between">
                                    <span>
                                        Sous-total
                                    </span>

                                    <span>
                                        {Number(
                                            order.subtotal
                                        ).toLocaleString(
                                            'fr-FR'
                                        )}{' '}
                                        FCFA
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>
                                        Livraison
                                    </span>

                                    <span>
                                        {Number(
                                            order.delivery_fee
                                        ).toLocaleString(
                                            'fr-FR'
                                        )}{' '}
                                        FCFA
                                    </span>
                                </div>

                                <div className="border-t pt-4">

                                    <div className="flex justify-between text-xl font-bold">

                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            {Number(
                                                order.total
                                            ).toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </div>

            </div>

        </div>
    )
}


Show.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
