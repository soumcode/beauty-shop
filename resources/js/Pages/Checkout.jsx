import { Head, Link, useForm } from '@inertiajs/react'
import {
    ArrowLeft,
    Check,
    CreditCard,
    MapPin,
    ShoppingBag,
} from 'lucide-react'
import { useEffect } from 'react'

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
import { useCart } from '@/contexts/CartContext'

export default function Checkout({
    user,
    addresses,
}) {
    const {
        cartItems,
        getCartTotal,
        clearCart,
    } = useCart()

    const defaultAddress =
        addresses.find(
            (address) => address.is_default
        ) || addresses[0]

    const form = useForm({
        address_id: defaultAddress?.id
            ? String(defaultAddress.id)
            : '',

        name: defaultAddress?.name || user?.name || '',

        phone:
            defaultAddress?.phone ||
            user?.phone ||
            '',

        city: defaultAddress?.city || '',

        commune: defaultAddress?.commune || '',

        quartier: defaultAddress?.quartier || '',

        address: defaultAddress?.address || '',

        payment_method: 'cash_on_delivery',

        items: [],
    })

    useEffect(() => {
        if (!defaultAddress) {
            return
        }

        form.setData({
            ...form.data,
            address_id: String(defaultAddress.id),
            name: defaultAddress.name || '',
            phone: defaultAddress.phone || '',
            city: defaultAddress.city || '',
            commune: defaultAddress.commune || '',
            quartier: defaultAddress.quartier || '',
            address: defaultAddress.address || '',
        })
    }, [defaultAddress?.id])

    const handleAddressChange = (event) => {
        const addressId = event.target.value

        if (!addressId) {
            form.setData({
                ...form.data,
                address_id: '',
                name: user?.name || '',
                phone: user?.phone || '',
                city: '',
                commune: '',
                quartier: '',
                address: '',
            })

            return
        }

        const selectedAddress = addresses.find(
            (address) =>
                String(address.id) === addressId
        )

        if (!selectedAddress) {
            return
        }

        form.setData({
            ...form.data,
            address_id: String(selectedAddress.id),
            name: selectedAddress.name || '',
            phone: selectedAddress.phone || '',
            city: selectedAddress.city || '',
            commune: selectedAddress.commune || '',
            quartier: selectedAddress.quartier || '',
            address: selectedAddress.address || '',
        })
    }

    const submit = (event) => {
        event.preventDefault()

        const items = cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }))

        form.transform((data) => ({
            ...data,
            items,
        }))

        form.post(route('checkout.store'), {
            onSuccess: () => {
                clearCart()
            },
        })
    }

    const subtotal = getCartTotal()

    const deliveryFee = 2000

    const total = subtotal + deliveryFee

    const hasSelectedAddress =
        form.data.address_id !== ''

    if (cartItems.length === 0) {
        return (
            <>
                <Head title="Commande" />

                <div className="mx-auto max-w-3xl p-6">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h1 className="text-2xl font-bold">
                                Votre panier est vide
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Ajoutez des produits avant de
                                passer une commande.
                            </p>

                            <Button
                                asChild
                                className="mt-6"
                            >
                                <Link
                                    href={route(
                                        'products.index'
                                    )}
                                >
                                    Voir les produits
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title="Passer la commande" />

            <div className="mx-auto max-w-6xl space-y-8 p-6">
                {}
                <Button
                    asChild
                    variant="ghost"
                >
                    <Link href={route('cart')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au panier
                    </Link>
                </Button>

                <div>
                    <h1 className="text-3xl font-bold">
                        Passer la commande
                    </h1>

                    <p className="text-muted-foreground">
                        Vérifiez vos informations avant de
                        confirmer votre commande.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-8 lg:grid-cols-3"
                >
                    {}
                    <div className="space-y-6 lg:col-span-2">
                        {}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Adresse de livraison
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {addresses.length > 0 ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="address_id">
                                            Choisir une adresse enregistrée
                                        </Label>

                                        <select
                                            id="address_id"
                                            value={form.data.address_id}
                                            onChange={handleAddressChange}
                                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">
                                                Saisir une nouvelle adresse
                                            </option>

                                            {addresses.map(
                                                (address) => (
                                                    <option
                                                        key={address.id}
                                                        value={address.id}
                                                    >
                                                        {address.name} -{' '}
                                                        {address.commune}{' '}
                                                        /{' '}
                                                        {address.quartier}
                                                        {address.is_default
                                                            ? ' - Par défaut'
                                                            : ''}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        {form.errors.address_id && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.errors
                                                        .address_id
                                                }
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Vous n'avez encore aucune
                                            adresse enregistrée.
                                        </p>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                        >
                                            <Link
                                                href={route(
                                                    'client.addresses.create'
                                                )}
                                            >
                                                Ajouter une adresse
                                            </Link>
                                        </Button>
                                    </div>
                                )}

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nom complet
                                    </Label>

                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        disabled={hasSelectedAddress}
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

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        Téléphone
                                    </Label>

                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.data.phone}
                                        disabled={hasSelectedAddress}
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

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="city">
                                        Ville
                                    </Label>

                                    <Input
                                        id="city"
                                        value={form.data.city}
                                        disabled={hasSelectedAddress}
                                        onChange={(event) =>
                                            form.setData(
                                                'city',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Abidjan"
                                    />

                                    {form.errors.city && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.city}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="commune">
                                        Commune
                                    </Label>

                                    <Input
                                        id="commune"
                                        value={form.data.commune}
                                        disabled={hasSelectedAddress}
                                        onChange={(event) =>
                                            form.setData(
                                                'commune',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Cocody"
                                    />

                                    {form.errors.commune && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.commune}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="quartier">
                                        Quartier
                                    </Label>

                                    <Input
                                        id="quartier"
                                        value={form.data.quartier}
                                        disabled={hasSelectedAddress}
                                        onChange={(event) =>
                                            form.setData(
                                                'quartier',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Riviera"
                                    />

                                    {form.errors.quartier && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.quartier}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        Adresse complète
                                    </Label>

                                    <textarea
                                        id="address"
                                        value={form.data.address}
                                        disabled={hasSelectedAddress}
                                        onChange={(event) =>
                                            form.setData(
                                                'address',
                                                event.target.value
                                            )
                                        }
                                        className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Exemple : près de la pharmacie..."
                                    />

                                    {form.errors.address && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.address}
                                        </p>
                                    )}
                                </div>

                                {hasSelectedAddress && (
                                    <p className="text-sm text-muted-foreground">
                                        Vous utilisez une adresse
                                        enregistrée. Pour modifier ces
                                        informations, sélectionnez
                                        « Saisir une nouvelle adresse »
                                        ou modifiez l'adresse depuis votre
                                        espace client.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Mode de paiement
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {}
                                <label
                                    htmlFor="cash_on_delivery"
                                    className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${
                                        form.data.payment_method ===
                                        'cash_on_delivery'
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:bg-muted/50'
                                    }`}
                                >
                                    <input
                                        id="cash_on_delivery"
                                        type="radio"
                                        name="payment_method"
                                        value="cash_on_delivery"
                                        checked={
                                            form.data.payment_method ===
                                            'cash_on_delivery'
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'payment_method',
                                                event.target.value
                                            )
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <Check className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Paiement à la livraison
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Vous paierez votre commande
                                            au moment de la livraison.
                                        </p>
                                    </div>
                                </label>

                                {}
                                <label
                                    htmlFor="online"
                                    className="flex cursor-not-allowed items-start gap-4 rounded-lg border p-4 opacity-60"
                                >
                                    <input
                                        id="online"
                                        type="radio"
                                        name="payment_method"
                                        value="online"
                                        disabled
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <CreditCard className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium">
                                                Paiement en ligne
                                            </p>

                                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                Bientôt disponible
                                            </span>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            Payez avec Wave, Orange Money,
                                            MTN Money et d'autres moyens
                                            via CinetPay.
                                        </p>
                                    </div>
                                </label>

                                {form.errors.payment_method && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.payment_method}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={
                                form.processing ||
                                cartItems.length === 0
                            }
                        >
                            {form.processing
                                ? 'Création de la commande...'
                                : 'Confirmer la commande'}
                        </Button>
                    </div>

                    {}
                    <div>
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>
                                    Résumé
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between gap-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.name}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    × {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-medium">
                                                {(
                                                    Number(
                                                        item.price
                                                    ) *
                                                    item.quantity
                                                ).toLocaleString(
                                                    'fr-FR'
                                                )}{' '}
                                                FCFA
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Sous-total
                                        </span>

                                        <span>
                                            {subtotal.toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Livraison
                                        </span>

                                        <span>
                                            {deliveryFee.toLocaleString(
                                                'fr-FR'
                                            )}{' '}
                                            FCFA
                                        </span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>

                                            <span className="text-lg font-bold">
                                                {total.toLocaleString(
                                                    'fr-FR'
                                                )}{' '}
                                                FCFA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    )
}

Checkout.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
