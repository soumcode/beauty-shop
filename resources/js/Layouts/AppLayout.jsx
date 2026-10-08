import {
    BarChart3,
    Bell,
    Heart,
    LayoutDashboard,
    LogOut,
    MapPin,
    Package,
    ShoppingBag,
    ShoppingCart,
    Tag,
    User,
} from 'lucide-react'

import {
    Link,
    router,
    usePage,
} from '@inertiajs/react'

import { useState } from 'react'

export default function AppLayout({ children }) {
    const { auth } = usePage().props

    const user = auth?.user

    const unreadNotificationsCount =
        auth?.unreadNotificationsCount ?? 0

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false)

    const clientNavigation = [
        {
            label: 'Mon dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
        },
        {
            label: 'Produits',
            href: route('products.index'),
            icon: ShoppingBag,
        },
        {
            label: 'Mes commandes',
            href: route('client.orders.index'),
            icon: Package,
        },
        {
            label: 'Mes notifications',
            href: route(
                'client.notifications.index'
            ),
            icon: Bell,
            badge: unreadNotificationsCount,
        },
        {
            label: 'Mes favoris',
            href: route(
                'client.favorites.index'
            ),
            icon: Heart,
        },
        {
            label: 'Mon panier',
            href: route('cart.index'),
            icon: ShoppingCart,
        },
        {
            label: 'Mes adresses',
            href: route(
                'client.addresses.index'
            ),
            icon: MapPin,
        },
        {
            label: 'Mon profil',
            href: route('profile.edit'),
            icon: User,
        },
    ]

    const adminNavigation = [
        {
            label: 'Dashboard',
            href: route('admin.dashboard'),
            icon: LayoutDashboard,
        },
        {
            label: 'Produits',
            href: route(
                'admin.products.index'
            ),
            icon: ShoppingBag,
        },
        {
            label: 'Stock',
            href: route(
                'admin.stock.index'
            ),
            icon: Package,
        },
        {
            label: 'Catégories',
            href: route(
                'admin.categories.index'
            ),
            icon: BarChart3,
        },
        {
            label: 'Commandes',
            href: route(
                'admin.orders.index'
            ),
            icon: Package,
        },
        {
            label: 'Promotions',
            href: route(
                'admin.promotions.index'
            ),
            icon: Tag,
        },
    ]

    const livreurNavigation = [
        {
            label: 'Dashboard',
            href: route('livreur.dashboard'),
            icon: LayoutDashboard,
        },
        {
            label: 'Mes livraisons',
            href: route(
                'livreur.deliveries.index'
            ),
            icon: Package,
        },
    ]

    const navigation =
        user?.role === 'admin'
            ? adminNavigation
            : user?.role === 'livreur'
                ? livreurNavigation
                : clientNavigation

    const handleLogout = () => {
        router.post(
            route('logout')
        )
    }

    const isActive = (href) => {
        return window.location.href === href
    }

    return (
        <div className="min-h-screen bg-muted/30">

            {/* Menu mobile */}

            <div className="border-b bg-background md:hidden">

                <div className="flex items-center justify-between px-4 py-4">

                    <Link
                        href={route(
                            'products.index'
                        )}
                        className="text-xl font-bold"
                    >
                        Ma Boutique
                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        className="rounded-md border px-3 py-2"
                    >
                        Menu
                    </button>

                </div>

                {mobileMenuOpen && (
                    <div className="border-t px-4 py-4">

                        <nav className="space-y-2">

                            {navigation.map(
                                (item) => {
                                    const Icon =
                                        item.icon

                                    return (
                                        <Link
                                            key={
                                                item.label
                                            }
                                            href={
                                                item.href
                                            }
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                                        >
                                            <div className="flex items-center gap-3">

                                                <Icon className="h-5 w-5" />

                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                            </div>

                                            {item.badge > 0 && (
                                                <span className="flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-xs font-semibold text-destructive-foreground">
                                                    {item.badge > 99
                                                        ? '99+'
                                                        : item.badge}
                                                </span>
                                            )}

                                        </Link>
                                    )
                                }
                            )}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                            >
                                <LogOut className="h-5 w-5" />

                                <span>
                                    Déconnexion
                                </span>
                            </button>

                        </nav>

                    </div>
                )}

            </div>

            <div className="flex min-h-screen">

                {/* Sidebar desktop */}

                <aside className="hidden w-64 border-r bg-background md:block">

                    <div className="flex h-full flex-col">

                        {/* Logo */}

                        <div className="border-b px-6 py-6">

                            <Link
                                href={route(
                                    'products.index'
                                )}
                                className="text-xl font-bold"
                            >
                                Ma Boutique
                            </Link>

                        </div>

                        {/* Utilisateur */}

                        <div className="border-b px-6 py-4">

                            <p className="font-semibold">
                                {user?.name}
                            </p>

                            <p className="text-sm capitalize text-muted-foreground">
                                {user?.role}
                            </p>

                        </div>

                        {/* Navigation */}

                        <nav className="flex-1 space-y-1 p-4">

                            {navigation.map(
                                (item) => {
                                    const Icon =
                                        item.icon

                                    const active =
                                        isActive(
                                            item.href
                                        )

                                    return (
                                        <Link
                                            key={
                                                item.label
                                            }
                                            href={
                                                item.href
                                            }
                                            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${
                                                active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">

                                                <Icon className="h-5 w-5" />

                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                            </div>

                                            {item.badge > 0 && (
                                                <span
                                                    className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                                                        active
                                                            ? 'bg-primary-foreground text-primary'
                                                            : 'bg-destructive text-destructive-foreground'
                                                    }`}
                                                >
                                                    {item.badge > 99
                                                        ? '99+'
                                                        : item.badge}
                                                </span>
                                            )}

                                        </Link>
                                    )
                                }
                            )}

                        </nav>

                        {/* Déconnexion */}

                        <div className="border-t p-4">

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                            >
                                <LogOut className="h-5 w-5" />

                                <span>
                                    Déconnexion
                                </span>
                            </button>

                        </div>

                    </div>

                </aside>

                {/* Contenu principal */}

                <main className="flex-1">

                    {/* Header desktop */}

                    <header className="hidden border-b bg-background px-6 py-4 md:block">

                        <div className="flex items-center justify-between">

                            <div>

                                <h1 className="text-lg font-semibold">
                                    Ma Boutique
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Bienvenue,{' '}
                                    {user?.name}
                                </p>

                            </div>

                        </div>

                    </header>

                    {/* Page */}

                    <div>
                        {children}
                    </div>

                </main>

            </div>

        </div>
    )
}
