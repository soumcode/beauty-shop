import {
    Link,
    router,
} from '@inertiajs/react'

import {
    Edit,
    Plus,
    Power,
    Trash2,
} from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import AppLayout from '@/layouts/AppLayout'

export default function Index({
    promotions,
    filters,
}) {
    const handleDelete = (promotion) => {
        if (promotion.usage_count > 0) {
            window.alert(
                'Cette promotion a déjà été utilisée. Vous pouvez la désactiver mais pas la supprimer.'
            )

            return
        }

        const confirmed = window.confirm(
            `Voulez-vous supprimer la promotion "${promotion.code}" ?`
        )

        if (!confirmed) {
            return
        }

        router.delete(
            route(
                'admin.promotions.destroy',
                promotion.id
            ),
            {
                preserveScroll: true,
            }
        )
    }

    const togglePromotion = (promotion) => {
        router.patch(
            route(
                'admin.promotions.toggle',
                promotion.id
            ),
            {},
            {
                preserveScroll: true,
            }
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl px-6 py-8">

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Promotions
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Gérez les codes promo de votre boutique.
                        </p>
                    </div>

                    <Button asChild>
                        <Link
                            href={route(
                                'admin.promotions.create'
                            )}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle promotion
                        </Link>
                    </Button>

                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>
                            Rechercher une promotion
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            method="GET"
                            action={route(
                                'admin.promotions.index'
                            )}
                            className="grid gap-4 md:grid-cols-4"
                        >

                            <Input
                                name="search"
                                placeholder="Code ou nom..."
                                defaultValue={
                                    filters.search ?? ''
                                }
                            />

                            <select
                                name="type"
                                defaultValue={
                                    filters.type ?? ''
                                }
                                className="h-10 rounded-md border bg-background px-3"
                            >
                                <option value="">
                                    Tous les types
                                </option>

                                <option value="percentage">
                                    Pourcentage
                                </option>

                                <option value="fixed">
                                    Montant fixe
                                </option>
                            </select>

                            <select
                                name="status"
                                defaultValue={
                                    filters.status ?? ''
                                }
                                className="h-10 rounded-md border bg-background px-3"
                            >
                                <option value="">
                                    Tous les statuts
                                </option>

                                <option value="active">
                                    Actives
                                </option>

                                <option value="inactive">
                                    Inactives
                                </option>
                            </select>

                            <Button type="submit">
                                Rechercher
                            </Button>

                        </form>
                    </CardContent>
                </Card>

                {promotions.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Aucune promotion trouvée.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">

                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Code
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Nom
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Réduction
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Utilisations
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Statut
                                            </th>

                                            <th className="px-6 py-4 text-right text-sm font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {promotions.data.map(
                                            (promotion) => (
                                                <tr
                                                    key={
                                                        promotion.id
                                                    }
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold">
                                                            {
                                                                promotion.code
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {
                                                            promotion.name
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {promotion.type ===
                                                        'percentage'
                                                            ? `${Number(
                                                                  promotion.value
                                                              )}%`
                                                            : `${Number(
                                                                  promotion.value
                                                              ).toLocaleString(
                                                                  'fr-FR'
                                                              )} FCFA`}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {promotion.usage_count}

                                                        {promotion.usage_limit && (
                                                            <span className="text-muted-foreground">
                                                                {' '}
                                                                /
                                                                {' '}
                                                                {
                                                                    promotion.usage_limit
                                                                }
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {promotion.is_active ? (
                                                            <Badge>
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">

                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'admin.promotions.edit',
                                                                        promotion.id
                                                                    )}
                                                                    title="Modifier"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    togglePromotion(
                                                                        promotion
                                                                    )
                                                                }
                                                                title={
                                                                    promotion.is_active
                                                                        ? 'Désactiver'
                                                                        : 'Activer'
                                                                }
                                                            >
                                                                <Power className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        promotion
                                                                    )
                                                                }
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {promotions.links.map(
                        (link, index) => (
                            <Link
                                key={index}
                                href={
                                    link.url ?? '#'
                                }
                                className={`rounded-md border px-3 py-2 text-sm ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        )
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
