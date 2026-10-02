import { Link, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Edit({ driver }) {
    const {
        data,
        setData,
put,
        processing,
        errors,
    } = useForm({
        name: driver.name,
        email: driver.email,
        phone: driver.phone ?? '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()

        put(
            route(
                'admin.drivers.update',
                driver.id
            )
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-2xl">

                <div className="mb-6">

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link
                            href={route(
                                'admin.drivers.index'
                            )}
                        >
                            ← Retour
                        </Link>
                    </Button>

                </div>

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Modifier le livreur
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >

                            <div className="space-y-2">

                                <Label htmlFor="name">
                                    Nom complet
                                </Label>

                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="email">
                                    Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
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
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData(
                                            'phone',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.phone && (
                                    <p className="text-sm text-red-500">
                                        {errors.phone}
                                    </p>
                                )}

                            </div>

                            <div className="border-t pt-6">

                                <p className="mb-4 text-sm text-muted-foreground">
                                    Laissez les champs vides
                                    si vous ne souhaitez pas
                                    modifier le mot de passe.
                                </p>

                                <div className="space-y-6">

                                    <div className="space-y-2">

                                        <Label htmlFor="password">
                                            Nouveau mot de passe
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            value={
                                                data.password
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value
                                                )
                                            }
                                        />

                                        {errors.password && (
                                            <p className="text-sm text-red-500">
                                                {
                                                    errors.password
                                                }
                                            </p>
                                        )}

                                    </div>

                                    <div className="space-y-2">

                                        <Label htmlFor="password_confirmation">
                                            Confirmer le mot de passe
                                        </Label>

                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={
                                                data.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing
                                    ? 'Modification...'
                                    : 'Enregistrer'}
                            </Button>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}


Edit.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
