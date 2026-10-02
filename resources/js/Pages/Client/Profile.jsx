import { Head, useForm, usePage } from '@inertiajs/react'
import {
    Lock,
    Mail,
    Phone,
    Save,
    User,
} from 'lucide-react'

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

export default function Profile({ user }) {
    const { flash } = usePage().props

    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
    })

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const submitProfile = (event) => {
        event.preventDefault()

        profileForm.patch(
            route('client.profile.update')
        )
    }

    const submitPassword = (event) => {
        event.preventDefault()

        passwordForm.patch(
            route('client.profile.password.update'),
            {
                onSuccess: () => {
                    passwordForm.reset()
                },
            }
        )
    }

    return (
        <>
            <Head title="Mon profil" />

            <div className="mx-auto max-w-4xl space-y-8 p-6">
                {/* En-tête */}
                <div>
                    <h1 className="text-3xl font-bold">
                        Mon profil
                    </h1>

                    <p className="text-muted-foreground">
                        Gérez vos informations personnelles et votre mot
                        de passe.
                    </p>
                </div>

                {/* Message de succès */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Informations personnelles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informations personnelles
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submitProfile}
                            className="space-y-6"
                        >
                            {/* Nom */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nom complet
                                </Label>

                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="name"
                                        value={profileForm.data.name}
                                        onChange={(event) =>
                                            profileForm.setData(
                                                'name',
                                                event.target.value
                                            )
                                        }
                                        className="pl-10"
                                    />
                                </div>

                                {profileForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {profileForm.errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Adresse e-mail
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(event) =>
                                            profileForm.setData(
                                                'email',
                                                event.target.value
                                            )
                                        }
                                        className="pl-10"
                                    />
                                </div>

                                {profileForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {profileForm.errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Téléphone
                                </Label>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileForm.data.phone}
                                        onChange={(event) =>
                                            profileForm.setData(
                                                'phone',
                                                event.target.value
                                            )
                                        }
                                        className="pl-10"
                                        placeholder="0700000000"
                                    />
                                </div>

                                {profileForm.errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {profileForm.errors.phone}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={profileForm.processing}
                            >
                                <Save className="mr-2 h-4 w-4" />

                                {profileForm.processing
                                    ? 'Enregistrement...'
                                    : 'Enregistrer les modifications'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Mot de passe */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Changer mon mot de passe
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submitPassword}
                            className="space-y-6"
                        >
                            {/* Mot de passe actuel */}
                            <div className="space-y-2">
                                <Label htmlFor="current_password">
                                    Mot de passe actuel
                                </Label>

                                <Input
                                    id="current_password"
                                    type="password"
                                    value={
                                        passwordForm.data
                                            .current_password
                                    }
                                    onChange={(event) =>
                                        passwordForm.setData(
                                            'current_password',
                                            event.target.value
                                        )
                                    }
                                />

                                {passwordForm.errors
                                    .current_password && (
                                    <p className="text-sm text-destructive">
                                        {
                                            passwordForm.errors
                                                .current_password
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Nouveau mot de passe */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Nouveau mot de passe
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    value={
                                        passwordForm.data.password
                                    }
                                    onChange={(event) =>
                                        passwordForm.setData(
                                            'password',
                                            event.target.value
                                        )
                                    }
                                />

                                {passwordForm.errors.password && (
                                    <p className="text-sm text-destructive">
                                        {passwordForm.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirmation */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmer le nouveau mot de passe
                                </Label>

                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={
                                        passwordForm.data
                                            .password_confirmation
                                    }
                                    onChange={(event) =>
                                        passwordForm.setData(
                                            'password_confirmation',
                                            event.target.value
                                        )
                                    }
                                />

                                {passwordForm.errors
                                    .password_confirmation && (
                                    <p className="text-sm text-destructive">
                                        {
                                            passwordForm.errors
                                                .password_confirmation
                                        }
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={passwordForm.processing}
                            >
                                <Lock className="mr-2 h-4 w-4" />

                                {passwordForm.processing
                                    ? 'Modification...'
                                    : 'Modifier le mot de passe'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Profile.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
