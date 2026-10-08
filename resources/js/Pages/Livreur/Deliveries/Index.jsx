import { Head, Link } from '@inertiajs/react'

import {
    MapPin,
    Package,
    Truck,
    ArrowRight,
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

export default function Index({
    deliveries,
    statusOptions,
}) {
    const getVariant = (status) => {
        if (status === 'delivered') {
            return 'default'
        }

        if (status === 'failed') {
            return 'destructive'
        }

        return 'secondary'
    }

    return (
        <>
            <Head title="Mes livraisons" />

            <div className="min-h-screen bg-muted/30 p-6">

                <div className="mx-auto max-w-6xl">

                    {/* En-tête */}

                    <div className="mb-8">

                        <div className="flex items-center gap-3">

                            <Truck className="h-8 w-8" />

                            <h1 className="text-3xl font-bold">
                                Mes livraisons
                            </h1>

                        </div>

                        <p className="mt-2 text-muted-foreground">
                            Consultez et gérez les commandes qui vous sont
                            attribuées.
                        </p>

                    </div>

                    {/* Liste */}

                    {deliveries.data.length === 0 ? (
                        <Card>

                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">

                                <Package className="h-12 w-12 text-muted-foreground" />

                                <h2 className="mt-4 text-xl font-semibold">
                                    Aucune livraison
                                </h2>

                                <p className="mt-2 max-w-md text-muted-foreground">
                                    Aucune commande ne vous est actuellement
                                    attribuée.
                                </p>

                            </CardContent>

                        </Card>
                    ) : (
                        <div className="space-y-4">

                            {deliveries.data.map((delivery) => (

                                <Card key={delivery.id}>

                                    <CardHeader>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                            <div>

                                                <CardTitle>
                                                    Commande #{delivery.order?.id}
                                                </CardTitle>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Livraison #{delivery.id}
                                                </p>

                                            </div>

                                            <Badge
                                                variant={getVariant(
                                                    delivery.status
                                                )}
                                            >
                                                {statusOptions[
                                                    delivery.status
                                                ] ?? delivery.status}
                                            </Badge>

                                        </div>

                                    </CardHeader>

                                    <CardContent>

                                        <div className="grid gap-4 md:grid-cols-2">

                                            {/* Client */}

                                            <div>

                                                <p className="text-sm font-medium">
                                                    Client
                                                </p>

                                                <p className="mt-1 text-muted-foreground">
                                                    {delivery.order?.delivery_name ??
                                                        delivery.order?.user?.name ??
                                                        'Non renseigné'}
                                                </p>

                                                {delivery.order?.delivery_phone && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            delivery.order
                                                                .delivery_phone
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* Adresse */}

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <MapPin className="h-4 w-4" />

                                                    <p className="text-sm font-medium">
                                                        Adresse
                                                    </p>

                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground">

                                                    {delivery.order?.delivery_commune ??
                                                        'Commune non renseignée'}

                                                    {' - '}

                                                    {delivery.order?.delivery_quartier ??
                                                        'Quartier non renseigné'}

                                                </p>

                                            </div>

                                        </div>

                                        {/* Bouton */}

                                        <div className="mt-6 flex justify-end">

                                            <Button
                                                variant="outline"
                                                asChild
                                            >

                                                <Link
                                                    href={route(
                                                        'livreur.deliveries.show',
                                                        delivery.id
                                                    )}
                                                >
                                                    Voir les détails

                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>

                                            </Button>

                                        </div>

                                    </CardContent>

                                </Card>

                            ))}

                        </div>
                    )}

                    {/* Pagination */}

                    {deliveries.links?.length > 0 && (
                        <div className="mt-8 flex flex-wrap justify-center gap-2">

                            {deliveries.links.map(
                                (link, index) => (
                                    <Link
                                        key={index}
                                        href={
                                            link.url ?? '#'
                                        }
                                        className={`rounded-md border px-3 py-2 text-sm ${
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : 'hover:bg-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>
        </>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
