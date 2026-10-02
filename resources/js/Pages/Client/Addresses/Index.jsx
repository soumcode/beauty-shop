import { Head, Link, router, usePage } from '@inertiajs/react'
import {
    MapPin,
    Pencil,
    Plus,
    Star,
    Trash2,
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

export default function Index({ addresses }) {
    const { flash } = usePage().props

    const deleteAddress = (addressId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) {
            return
        }

        router.delete(
            route('client.addresses.destroy', addressId)
        )
    }

    const setDefault = (addressId) => {
        router.patch(
            route('client.addresses.set-default', addressId)
        )
    }

    return (
        <>
            <Head title="Mes adresses" />

            <div className="mx-auto max-w-5xl space-y-8 p-6">
                {/* En-tête */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Mes adresses
                        </h1>

                        <p className="text-muted-foreground">
                            Gérez vos adresses de livraison.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={route('client.addresses.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une adresse
                        </Link>
                    </Button>
                </div>

                {/* Message */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Aucune adresse */}
                {addresses.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h2 className="text-xl font-semibold">
                                Aucune adresse enregistrée
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                Ajoutez une adresse pour faciliter vos
                                prochaines commandes.
                            </p>

                            <Button asChild className="mt-6">
                                <Link
                                    href={route(
                                        'client.addresses.create'
                                    )}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter une adresse
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {addresses.map((address) => (
                            <Card
                                key={address.id}
                                className={
                                    address.is_default
                                        ? 'border-primary'
                                        : ''
                                }
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />

                                            {address.name}
                                        </CardTitle>

                                        {address.is_default && (
                                            <Badge>
                                                Adresse par défaut
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-medium">
                                                Téléphone :
                                            </span>{' '}
                                            {address.phone}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Ville :
                                            </span>{' '}
                                            {address.city}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Commune :
                                            </span>{' '}
                                            {address.commune}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Quartier :
                                            </span>{' '}
                                            {address.quartier}
                                        </p>

                                        <p>
                                            <span className="font-medium">
                                                Adresse :
                                            </span>{' '}
                                            {address.address}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 border-t pt-4">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={route(
                                                    'client.addresses.edit',
                                                    address.id
                                                )}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Modifier
                                            </Link>
                                        </Button>

                                        {!address.is_default && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setDefault(
                                                        address.id
                                                    )
                                                }
                                            >
                                                <Star className="mr-2 h-4 w-4" />
                                                Définir par défaut
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                deleteAddress(
                                                    address.id
                                                )
                                            }
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Supprimer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
