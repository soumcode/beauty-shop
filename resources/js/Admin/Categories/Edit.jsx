import { Link, useForm } from '@inertiajs/react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Edit({ category }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        is_active: Boolean(category.is_active),
    })

    const submit = (e) => {
        e.preventDefault()

        put(
            route(
                'admin.categories.update',
                category.id
            )
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button variant="outline" asChild>
                    <Link href={route('admin.categories.index')}>
                        Retour
                    </Link>
                </Button>
            </div>

            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>
                        Modifier la catégorie
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nom
                            </Label>

                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug
                            </Label>

                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                            />

                            {errors.slug && (
                                <p className="text-sm text-red-500">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description
                            </Label>

                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData(
                                        'description',
                                        e.target.value
                                    )
                                }
                                className="min-h-32 w-full rounded-md border px-3 py-2"
                            />

                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Modification...'
                                    : 'Modifier la catégorie'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'admin.categories.index'
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
    )
}
