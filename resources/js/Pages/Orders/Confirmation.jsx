import { Link } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Confirmation({ order }) {
    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-4xl">

                <Card>

                    <CardHeader className="text-center">

                        <Badge className="mx-auto w-fit">
                            Commande confirmée
                        </Badge>

                        <CardTitle className="mt-4 text-3xl">
                            Merci pour votre commande 🎉
                        </CardTitle>

                        <p className="text-muted-foreground">
                            Votre commande #{order.id} a bien
                            été enregistrée.
                        </p>

                    </CardHeader>

                    <CardContent className="space-y-8">

                        {}
                        <div className="rounded-lg border p-5">

                            <p className="text-sm text-muted-foreground">
                                État de la commande
                            </p>

                            <p className="mt-2 font-semibold">
                                En attente
                            </p>

                        </div>

                        {}
                        <div>

                            <h2 className="mb-4 text-xl font-semibold">
                                Produits
                            </h2>

                            <div className="space-y-4">

                                {order.items.map(
                                    (item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between border-b pb-4"
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

                        </div>

                        {}
                        <div>

                            <h2 className="mb-4 text-xl font-semibold">
                                Livraison
                            </h2>

                            <div className="space-y-1 text-muted-foreground">

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

                            </div>

                        </div>

                        {}
                        <div className="rounded-lg border p-5">

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

                            <div className="mt-3 flex justify-between">

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

                            <div className="my-4 border-t" />

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

                        {}
                        <div className="flex flex-col gap-3 sm:flex-row">

                            <Button asChild>
                                <Link
                                    href={route(
                                        'products.index'
                                    )}
                                >
                                    Continuer mes achats
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'dashboard'
                                    )}
                                >
                                    Mon espace
                                </Link>
                            </Button>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}


Confirmation.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
