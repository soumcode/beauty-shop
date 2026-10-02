import { Link, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
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

export default function Edit({
    product,
    categories,
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        progress,
    } = useForm({
        _method: 'put',

        category_id: product.category_id,
        name: product.name,
        slug: product.slug,
        description:
            product.description ?? '',
        price: product.price,
        stock: product.stock,
        status: product.status,

        image: null,
    })

    const [imagePreview, setImagePreview] =
        useState(
            product.image
                ? `/storage/${product.image}`
                : null
        )

    /*
     * Si l'utilisateur sélectionne
     * une nouvelle image, on affiche
     * cette nouvelle image.
     */
    useEffect(() => {
        if (!data.image) {
            return
        }

        const objectUrl = URL.createObjectURL(
            data.image
        )

        setImagePreview(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [data.image])

    const submit = (e) => {
        e.preventDefault()

        post(
            route(
                'admin.products.update',
                product.id
            ),
            {
                forceFormData: true,
            }
        )
    }

    return (
        <div className="p-6">

            {/* Retour */}
            <div className="mb-6">

                <Button
                    variant="outline"
                    asChild
                >
                    <Link
                        href={route(
                            'admin.products.index'
                        )}
                    >
                        Retour
                    </Link>
                </Button>

            </div>

            {/* Formulaire */}
            <Card className="mx-auto max-w-2xl">

                <CardHeader>

                    <CardTitle>
                        Modifier le produit
                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >

                        {/* Catégorie */}
                        <div className="space-y-2">

                            <Label htmlFor="category_id">
                                Catégorie
                            </Label>

                            <select
                                id="category_id"
                                value={
                                    data.category_id
                                }
                                onChange={(e) =>
                                    setData(
                                        'category_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {errors.category_id && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.category_id
                                    }
                                </p>
                            )}

                        </div>

                        {/* Nom */}
                        <div className="space-y-2">

                            <Label htmlFor="name">
                                Nom
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

                        {/* Slug */}
                        <div className="space-y-2">

                            <Label htmlFor="slug">
                                Slug
                            </Label>

                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData(
                                        'slug',
                                        e.target.value
                                    )
                                }
                            />

                            {errors.slug && (
                                <p className="text-sm text-red-500">
                                    {errors.slug}
                                </p>
                            )}

                        </div>

                        {/* Description */}
                        <div className="space-y-2">

                            <Label htmlFor="description">
                                Description
                            </Label>

                            <textarea
                                id="description"
                                value={
                                    data.description
                                }
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
                                    {
                                        errors.description
                                    }
                                </p>
                            )}

                        </div>

                        {/* Prix + Stock */}
                        <div className="grid gap-6 sm:grid-cols-2">

                            {/* Prix */}
                            <div className="space-y-2">

                                <Label htmlFor="price">
                                    Prix
                                </Label>

                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData(
                                            'price',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}

                            </div>

                            {/* Stock */}
                            <div className="space-y-2">

                                <Label htmlFor="stock">
                                    Stock
                                </Label>

                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData(
                                            'stock',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.stock && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Statut */}
                        <div className="space-y-2">

                            <Label htmlFor="status">
                                Statut
                            </Label>

                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >

                                <option value="active">
                                    Actif
                                </option>

                                <option value="inactive">
                                    Inactif
                                </option>

                            </select>

                            {errors.status && (
                                <p className="text-sm text-red-500">
                                    {errors.status}
                                </p>
                            )}

                        </div>

                        {/* Image */}
                        <div className="space-y-2">

                            <Label htmlFor="image">
                                Image du produit
                            </Label>

                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files[0] ??
                                            null
                                    )
                                }
                            />

                            {errors.image && (
                                <p className="text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}

                        </div>

                        {/* Prévisualisation */}
                        {imagePreview && (
                            <div className="mt-4">

                                <p className="mb-2 text-sm font-medium">
                                    Image actuelle
                                </p>

                                <img
                                    src={imagePreview}
                                    alt={product.name}
                                    className="h-48 w-48 rounded-lg object-cover"
                                />

                            </div>
                        )}

                        {/* Progression */}
                        {progress && (
                            <div className="mt-4">

                                <div className="mb-1 text-sm">
                                    Téléversement :{' '}
                                    {
                                        progress.percentage
                                    }
                                    %
                                </div>

                                <div className="h-2 w-full rounded bg-gray-200">

                                    <div
                                        className="h-2 rounded bg-black"
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    />

                                </div>

                            </div>
                        )}

                        {/* Boutons */}
                        <div className="flex gap-3">

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Modification...'
                                    : 'Modifier le produit'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'admin.products.index'
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

Edit.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
