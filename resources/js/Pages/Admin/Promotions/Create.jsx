import {
    Link,
    useForm,
} from '@inertiajs/react'

import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Create() {
    const form = useForm({
        code: '',
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_discount: '',
        usage_limit: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
    })

    const submit = (event) => {
        event.preventDefault()

        form.post(
            route('admin.promotions.store')
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-3xl px-6 py-8">

                <div className="mb-8">
                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link
                            href={route(
                                'admin.promotions.index'
                            )}
                        >
                            ← Retour aux promotions
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Nouvelle promotion
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >

                            <div>
                                <label
                                    htmlFor="code"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Code promo
                                </label>

                                <Input
                                    id="code"
                                    value={
                                        form.data.code
                                    }
                                    onChange={(event) =>
                                        form.setData(
                                            'code',
                                            event.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="BIENVENUE10"
                                />

                                {form.errors.code && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.errors.code
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Nom
                                </label>

                                <Input
                                    id="name"
                                    value={
                                        form.data.name
                                    }
                                    onChange={(event) =>
                                        form.setData(
                                            'name',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Réduction nouveaux clients"
                                />

                                {form.errors.name && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.errors.name
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    value={
                                        form.data.description
                                    }
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    placeholder="Description de la promotion..."
                                />

                                {form.errors.description && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.errors.description
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="type"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Type
                                    </label>

                                    <select
                                        id="type"
                                        value={
                                            form.data.type
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'type',
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border bg-background px-3"
                                    >
                                        <option value="percentage">
                                            Pourcentage
                                        </option>

                                        <option value="fixed">
                                            Montant fixe
                                        </option>
                                    </select>

                                    {form.errors.type && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors.type
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="value"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Valeur
                                    </label>

                                    <Input
                                        id="value"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.data.value
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'value',
                                                event.target.value
                                            )
                                        }
                                        placeholder={
                                            form.data.type ===
                                            'percentage'
                                                ? '10'
                                                : '2000'
                                        }
                                    />

                                    {form.errors.value && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors.value
                                            }
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="min_order_amount"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Montant minimum de commande
                                    </label>

                                    <Input
                                        id="min_order_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.data
                                                .min_order_amount
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'min_order_amount',
                                                event.target.value
                                            )
                                        }
                                        placeholder="15000"
                                    />

                                    {form.errors.min_order_amount && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors
                                                    .min_order_amount
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="max_discount"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Réduction maximale
                                    </label>

                                    <Input
                                        id="max_discount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.data
                                                .max_discount
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'max_discount',
                                                event.target.value
                                            )
                                        }
                                        placeholder="5000"
                                    />

                                    {form.errors.max_discount && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors
                                                    .max_discount
                                            }
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div>
                                <label
                                    htmlFor="usage_limit"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Nombre maximum d'utilisations
                                </label>

                                <Input
                                    id="usage_limit"
                                    type="number"
                                    min="1"
                                    value={
                                        form.data.usage_limit
                                    }
                                    onChange={(event) =>
                                        form.setData(
                                            'usage_limit',
                                            event.target.value
                                        )
                                    }
                                    placeholder="100"
                                />

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Laissez vide pour une utilisation illimitée.
                                </p>

                                {form.errors.usage_limit && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.errors
                                                .usage_limit
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="starts_at"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Date de début
                                    </label>

                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={
                                            form.data.starts_at
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'starts_at',
                                                event.target.value
                                            )
                                        }
                                    />

                                    {form.errors.starts_at && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors
                                                    .starts_at
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="ends_at"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Date de fin
                                    </label>

                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={
                                            form.data.ends_at
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'ends_at',
                                                event.target.value
                                            )
                                        }
                                    />

                                    {form.errors.ends_at && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.errors
                                                    .ends_at
                                            }
                                        </p>
                                    )}
                                </div>

                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={
                                        form.data.is_active
                                    }
                                    onChange={(event) =>
                                        form.setData(
                                            'is_active',
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm font-medium">
                                    Promotion active
                                </span>
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row">

                                <Button
                                    type="submit"
                                    disabled={
                                        form.processing
                                    }
                                >
                                    {form.processing
                                        ? 'Enregistrement...'
                                        : 'Créer la promotion'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link
                                        href={route(
                                            'admin.promotions.index'
                                        )}
                                    >
                                        Annuler
                                    </Link>
                                </Button>

                            </div>

                        </form>

                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

Create.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
