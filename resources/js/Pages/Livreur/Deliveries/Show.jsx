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
        status: delivery.status,
    })

    const submit = (e) => {
        e.preventDefault()

        patch(
            route(
                'livreur.deliveries.update-status',
                delivery.id
            )
        )
    }

    return (
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
                            ← Retour
                        </Link>
                    </Button>

                </div>

                {/* En-tête */}
                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Livraison #{delivery.id}
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Commande #{delivery.order?.id}
                    </p>

                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Colonne principale */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Client */}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Client
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">

                                <p>
                                    <strong>
                                        Nom :
                                    </strong>{' '}
                                    {
                                        delivery.order
                                            ?.delivery_name
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Téléphone :
                                    </strong>{' '}
                                    {
                                        delivery.order
                                            ?.delivery_phone
                                    }
                                </p>

                            </CardContent>

                        </Card>

                        {/* Adresse */}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Adresse de livraison
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-1">

                                <p>
                                    {
                                        delivery.order
                                            ?.delivery_city
                                    }
                                </p>

                                <p>
                                    {
                                        delivery.order
                                            ?.delivery_commune
                                    }
                                </p>

                                <p>
                                    {
                                        delivery.order
                                            ?.delivery_quartier
                                    }
                                </p>

                                <p>
                                    {
                                        delivery.order
                                            ?.delivery_address
                                    }
                                </p>

                            </CardContent>

                        </Card>

                        {/* Produits */}
                        <Card>

                            <CardHeader>
                                <CardTitle>
                                    Produits
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="space-y-4">

                                    {delivery.order?.items?.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between border-b pb-3"
                                            >

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

                                                </div>

                                                <p className="font-medium">

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

                    </div>

                    {/* Gestion */}
                    <Card className="h-fit">

                        <CardHeader>
                            <CardTitle>
                                État de la livraison
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <Badge
                                variant={
                                    delivery.status ===
                                    'delivered'
                                        ? 'default'
                                        : delivery.status ===
                                            'failed'
                                          ? 'destructive'
                                          : 'secondary'
                                }
                                className="mb-6"
                            >
                                {
                                    statusOptions[
                                        delivery.status
                                    ]
                                }
                            </Badge>

                            {delivery.status !==
                                'delivered' &&
                                delivery.status !==
                                    'failed' && (

                                <form
                                    onSubmit={submit}
                                    className="space-y-4"
                                >

                                    <div>

                                        <label
                                            htmlFor="status"
                                            className="mb-2 block text-sm font-medium"
                                        >
                                            Modifier l'état
                                        </label>

                                        <select
                                            id="status"
                                            value={
                                                data.status
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border bg-background px-3 py-2"
                                        >

                                            {delivery.status ===
                                                'assigned' && (
                                                <>
                                                    <option value="picked_up">
                                                        Colis récupéré
                                                    </option>

                                                    <option value="failed">
                                                        Échec
                                                    </option>
                                                </>
                                            )}

                                            {delivery.status ===
                                                'picked_up' && (
                                                <>
                                                    <option value="out_for_delivery">
                                                        En cours de livraison
                                                    </option>

                                                    <option value="failed">
                                                        Échec
                                                    </option>
                                                </>
                                            )}

                                            {delivery.status ===
                                                'out_for_delivery' && (
                                                <>
                                                    <option value="delivered">
                                                        Livrée
                                                    </option>

                                                    <option value="failed">
                                                        Échec
                                                    </option>
                                                </>
                                            )}

                                        </select>

                                    </div>

                                    {errors.status && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors.status
                                            }
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Mise à jour...'
                                            : 'Mettre à jour'}
                                    </Button>

                                </form>
                            )}

                        </CardContent>

                    </Card>

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
