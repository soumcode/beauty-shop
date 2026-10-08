import {
    Head,
    Link,
    router,
    useForm,
    usePage,
} from '@inertiajs/react'

import {
    Heart,
    Star,
    Trash2,
} from 'lucide-react'

import { useState } from 'react'

import PublicLayout from '@/layouts/PublicLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

import { useCart } from '@/contexts/CartContext'

export default function Show({
    product,
    isFavorite = false,
    reviews = [],
    averageRating = 0,
    reviewCount = 0,
    canReview = false,
    userReview = null,
}) {
    const { auth } = usePage().props
    const user = auth?.user

    const { addToCart } = useCart()

    const [favorite, setFavorite] = useState(
        isFavorite
    )

    const [
        isLoadingFavorite,
        setIsLoadingFavorite,
    ] = useState(false)

    const [selectedRating, setSelectedRating] =
        useState(0)

    const isAvailable = product.stock > 0

    const reviewForm = useForm({
        rating: 0,
        comment: '',
    })

    const handleAddToCart = () => {
        addToCart(product)
    }

    const toggleFavorite = () => {
        if (!user) {
            router.visit(route('login'))
            return
        }

        if (isLoadingFavorite) {
            return
        }

        setIsLoadingFavorite(true)

        if (favorite) {
            router.delete(
                route(
                    'client.favorites.destroy',
                    product.id
                ),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setFavorite(false)
                    },
                    onFinish: () => {
                        setIsLoadingFavorite(false)
                    },
                }
            )
        } else {
            router.post(
                route(
                    'client.favorites.store',
                    product.id
                ),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setFavorite(true)
                    },
                    onFinish: () => {
                        setIsLoadingFavorite(false)
                    },
                }
            )
        }
    }

    const handleRatingClick = (rating) => {
        setSelectedRating(rating)

        reviewForm.setData(
            'rating',
            rating
        )
    }

    const submitReview = (event) => {
        event.preventDefault()

        if (!reviewForm.data.rating) {
            return
        }

        reviewForm.post(
            route(
                'client.reviews.store',
                product.id
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    reviewForm.reset(
                        'rating',
                        'comment'
                    )

                    setSelectedRating(0)
                },
            }
        )
    }

    const deleteReview = (reviewId) => {
        const confirmed = window.confirm(
            'Voulez-vous vraiment supprimer votre avis ?'
        )

        if (!confirmed) {
            return
        }

        router.delete(
            route(
                'client.reviews.destroy',
                reviewId
            ),
            {
                preserveScroll: true,
            }
        )
    }

    const renderStars = (
        rating,
        interactive = false
    ) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(
                    (star) => (
                        <button
                            key={star}
                            type={
                                interactive
                                    ? 'button'
                                    : undefined
                            }
                            disabled={
                                !interactive
                            }
                            onClick={
                                interactive
                                    ? () =>
                                          handleRatingClick(
                                              star
                                          )
                                    : undefined
                            }
                            className={
                                interactive
                                    ? 'rounded-sm transition hover:scale-110'
                                    : 'cursor-default'
                            }
                            aria-label={
                                interactive
                                    ? `${star} étoile${
                                          star > 1
                                              ? 's'
                                              : ''
                                      }`
                                    : undefined
                            }
                        >
                            <Star
                                className={`h-5 w-5 ${
                                    star <=
                                    Number(rating)
                                        ? 'fill-current text-yellow-400'
                                        : 'text-muted-foreground'
                                }`}
                            />
                        </button>
                    )
                )}
            </div>
        )
    }

    return (
        <>
            <Head title={product.name} />

            <div className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-6xl px-6 py-10">

                    {/* Retour */}
                    <Button
                        variant="outline"
                        asChild
                        className="mb-8"
                    >
                        <Link
                            href={route(
                                'products.index'
                            )}
                        >
                            ← Retour aux produits
                        </Link>
                    </Button>

                    {/* Produit */}
                    <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-2">

                            {/* Image */}
                            <div className="min-h-[400px] bg-muted">
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={
                                            product.name
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full min-h-[400px] items-center justify-center text-muted-foreground">
                                        Aucune image
                                    </div>
                                )}
                            </div>

                            {/* Informations */}
                            <CardContent className="flex flex-col justify-center p-8">

                                <div className="mb-4 flex items-start justify-between gap-4">

                                    <Badge
                                        variant="secondary"
                                        className="w-fit"
                                    >
                                        {
                                            product
                                                .category
                                                ?.name
                                        }
                                    </Badge>

                                    {user && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={
                                                toggleFavorite
                                            }
                                            disabled={
                                                isLoadingFavorite
                                            }
                                            title={
                                                favorite
                                                    ? 'Retirer des favoris'
                                                    : 'Ajouter aux favoris'
                                            }
                                            aria-label={
                                                favorite
                                                    ? 'Retirer des favoris'
                                                    : 'Ajouter aux favoris'
                                            }
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${
                                                    favorite
                                                        ? 'fill-current text-destructive'
                                                        : ''
                                                }`}
                                            />
                                        </Button>
                                    )}

                                </div>

                                <h1 className="text-3xl font-bold">
                                    {product.name}
                                </h1>

                                <p className="mt-4 text-3xl font-bold">
                                    {Number(
                                        product.price
                                    ).toLocaleString(
                                        'fr-FR'
                                    )}{' '}
                                    FCFA
                                </p>

                                {/* Note moyenne */}
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    {renderStars(
                                        averageRating
                                    )}

                                    <span className="text-sm font-medium">
                                        {averageRating > 0
                                            ? averageRating
                                            : 'Aucune note'}
                                    </span>

                                    <span className="text-sm text-muted-foreground">
                                        (
                                        {reviewCount}{' '}
                                        avis)
                                    </span>
                                </div>

                                <div className="mt-4">
                                    {isAvailable ? (
                                        <Badge>
                                            En stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            Rupture de stock
                                        </Badge>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h2 className="mb-2 text-lg font-semibold">
                                        Description
                                    </h2>

                                    <p className="leading-7 text-muted-foreground">
                                        {product.description ||
                                            'Aucune description disponible.'}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Stock disponible :{' '}
                                        {
                                            product.stock
                                        }
                                    </p>
                                </div>

                                <Button
                                    className="mt-8 w-full md:w-auto"
                                    disabled={
                                        !isAvailable
                                    }
                                    onClick={
                                        handleAddToCart
                                    }
                                >
                                    {isAvailable
                                        ? 'Ajouter au panier'
                                        : 'Produit indisponible'}
                                </Button>

                            </CardContent>
                        </div>
                    </Card>

                    {/* Avis */}
                    <div className="mt-8">

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Avis clients
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                {/* Formulaire */}
                                {user && canReview && (
                                    <div className="mb-8 rounded-lg border bg-muted/30 p-5">

                                        <h3 className="text-lg font-semibold">
                                            Donnez votre avis
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Votre commande a été
                                            livrée. Vous pouvez
                                            maintenant évaluer ce
                                            produit.
                                        </p>

                                        <form
                                            onSubmit={
                                                submitReview
                                            }
                                            className="mt-5 space-y-5"
                                        >

                                            <div>
                                                <p className="mb-2 text-sm font-medium">
                                                    Votre note
                                                </p>

                                                {renderStars(
                                                    selectedRating,
                                                    true
                                                )}

                                                {reviewForm.errors.rating && (
                                                    <p className="mt-2 text-sm text-destructive">
                                                        {
                                                            reviewForm
                                                                .errors
                                                                .rating
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="review-comment"
                                                    className="mb-2 block text-sm font-medium"
                                                >
                                                    Votre commentaire
                                                </label>

                                                <Textarea
                                                    id="review-comment"
                                                    value={
                                                        reviewForm
                                                            .data
                                                            .comment
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        reviewForm.setData(
                                                            'comment',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Partagez votre expérience avec ce produit..."
                                                    rows={4}
                                                />

                                                {reviewForm
                                                    .errors
                                                    .comment && (
                                                    <p className="mt-2 text-sm text-destructive">
                                                        {
                                                            reviewForm
                                                                .errors
                                                                .comment
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={
                                                    reviewForm.processing ||
                                                    selectedRating ===
                                                        0
                                                }
                                            >
                                                {reviewForm.processing
                                                    ? 'Publication...'
                                                    : 'Publier mon avis'}
                                            </Button>

                                        </form>
                                    </div>
                                )}

                                {/* Déjà évalué */}
                                {userReview && (
                                    <div className="mb-8 rounded-lg border bg-muted/30 p-5">

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                            <div>
                                                <h3 className="font-semibold">
                                                    Votre avis
                                                </h3>

                                                <div className="mt-2">
                                                    {renderStars(
                                                        userReview.rating
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    deleteReview(
                                                        userReview.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                Supprimer
                                            </Button>

                                        </div>

                                        {userReview.comment && (
                                            <p className="mt-4 leading-7 text-muted-foreground">
                                                {
                                                    userReview.comment
                                                }
                                            </p>
                                        )}

                                    </div>
                                )}

                                {/* Aucun avis */}
                                {reviews.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <Star className="mx-auto h-10 w-10 text-muted-foreground" />

                                        <h3 className="mt-4 text-lg font-semibold">
                                            Aucun avis pour le moment
                                        </h3>

                                        <p className="mt-2 text-muted-foreground">
                                            Soyez le premier à
                                            donner votre avis
                                            sur ce produit.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">

                                        {reviews.map(
                                            (review) => (
                                                <div
                                                    key={
                                                        review.id
                                                    }
                                                    className="border-b pb-6 last:border-0 last:pb-0"
                                                >

                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    review
                                                                        .user
                                                                        ?.name
                                                                }
                                                            </p>

                                                            <div className="mt-2">
                                                                {renderStars(
                                                                    review.rating
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(
                                                                review.created_at
                                                            ).toLocaleDateString(
                                                                'fr-FR',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                }
                                                            )}
                                                        </p>

                                                    </div>

                                                    {review.comment && (
                                                        <p className="mt-4 leading-7 text-muted-foreground">
                                                            {
                                                                review.comment
                                                            }
                                                        </p>
                                                    )}

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </>
    )
}

Show.layout = (page) => (
    <PublicLayout>
        {page}
    </PublicLayout>
)
