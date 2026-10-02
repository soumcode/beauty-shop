import { Link } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
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
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-6xl">

                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Mes livraisons
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Consultez les commandes qui vous sont
                        attribuées.
                    </p>

                </div>

                <div className="space-y-4">

                    {deliveries.data.length > 0 ? (
                        deliveries.data.map(
                            (delivery) => (
                                <Card key={delivery.id}>

                                    <CardContent className="p-5">

                                        <div className="flex flex-col justify-between gap-4 md:flex-row">

                                            <div>

                                                <p className="font-semibold">
                                                    Commande #
                                                    {
                                                        delivery
                                                            .order
                                                            ?.id
                                                    }
                                                </p>

                                                <p className="mt-1">
                                                    Client :{' '}
                                                    {
                                                        delivery
                                                            .order
                                                            ?.user
                                                            ?.name
                                                    }
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        delivery
                                                            .order
                                                            ?.delivery_commune
                                                    }
                                                    {' - '}
                                                    {
                                                        delivery
                                                            .order
                                                            ?.delivery_quartier
                                                    }
                                                </p>

                                            </div>

                                            <div className="flex items-center gap-4">

                                                <Badge
                                                    variant={getVariant(
                                                        delivery.status
                                                    )}
                                                >
                                                    {
                                                        statusOptions[
                                                            delivery.status
                                                        ]
                                                    }
                                                </Badge>

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
                                                        Voir
                                                    </Link>
                                                </Button>

                                            </div>

                                        </div>

                                    </CardContent>

                                </Card>
                            )
                        )
                    ) : (
                        <Card>

                            <CardContent className="py-12 text-center text-muted-foreground">
                                Aucune livraison ne vous est
                                actuellement attribuée.
                            </CardContent>

                        </Card>
                    )}

                </div>

            </div>

        </div>
    )
}


Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
