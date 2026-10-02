import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, Save } from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import AppLayout from '@/layouts/AppLayout'

export default function Edit({ address }) {
    const form = useForm({
        name: address.name || '',
        phone: address.phone || '',
        city: address.city || '',
        commune: address.commune || '',
        quartier: address.quartier || '',
        address: address.address || '',
    })

    const submit = (event) => {
        event.preventDefault()

        form.patch(
            route(
                'client.addresses.update',
                address.id
            )
        )
    }

    return (
        <>
            <Head title="Modifier une adresse" />

            <div className="mx-auto max-w-3xl space-y-8 p-6">
                <Button asChild variant="ghost">
                    <Link
                        href={route('client.addresses.index')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à mes adresses
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Modifier mon adresse
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nom
                                </Label>

                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData(
                                            'name',
                                            event.target.value
                                        )
                                    }
                                />

                                {form.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Téléphone
                                </Label>

                                <Input
                                    id="phone"
                                    type="tel"
                                    value={form.data.phone}
                                    onChange={(event) =>
                                        form.setData(
                                            'phone',
                                            event.target.value
                                        )
                                    }
                                />

                                {form.errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">
                                    Ville
                                </Label>

                                <Input
                                    id="city"
                                    value={form.data.city}
                                    onChange={(event) =>
                                        form.setData(
                                            'city',
                                            event.target.value
                                        )
                                    }
                                />

                                {form.errors.city && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="commune">
                                    Commune
                                </Label>

                                <Input
                                    id="commune"
                                    value={form.data.commune}
                                    onChange={(event) =>
                                        form.setData(
                                            'commune',
                                            event.target.value
                                        )
                                    }
                                />

                                {form.errors.commune && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.commune}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quartier">
                                    Quartier
                                </Label>

                                <Input
                                    id="quartier"
                                    value={form.data.quartier}
                                    onChange={(event) =>
                                        form.setData(
                                            'quartier',
                                            event.target.value
                                        )
                                    }
                                />

                                {form.errors.quartier && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.quartier}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    Adresse complète
                                </Label>

                                <textarea
                                    id="address"
                                    value={form.data.address}
                                    onChange={(event) =>
                                        form.setData(
                                            'address',
                                            event.target.value
                                        )
                                    }
                                    className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
                                />

                                {form.errors.address && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.address}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={form.processing}
                            >
                                <Save className="mr-2 h-4 w-4" />

                                {form.processing
                                    ? 'Modification...'
                                    : 'Enregistrer les modifications'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Edit.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
