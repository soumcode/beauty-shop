import { Link, router, usePage } from '@inertiajs/react'
import {
    BarChart3,
    Box,
    ClipboardList,
    FolderTree,
    LogOut,
    MapPin,
    Menu,
    ShoppingBag,
    Truck,
    UserRound,
    X,
} from 'lucide-react'
import { useState } from 'react'

export default function AppLayout({ children }) {
    const { auth } = usePage().props
    const user = auth?.user

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const role = user?.role

    const roleLabels = {
        admin: 'Administrateur',
        client: 'Client',
        livreur: 'Livreur',
    }

    const menus = {
        admin: [
            {
                label: 'Dashboard',
                href: route('admin.dashboard'),
                icon: BarChart3,
            },
            {
                label: 'Produits',
                href: route('admin.products.index'),
                icon: ShoppingBag,
            },
            {
                label: 'Catégories',
                href: route('admin.categories.index'),
                icon: FolderTree,
            },
            {
                label: 'Commandes',
                href: route('admin.orders.index'),
                icon: ClipboardList,
            },
            {
                label: 'Livreurs',
                href: route('admin.drivers.index'),
                icon: Truck,
            },
        ],

        client: [
            {
                label: 'Mon dashboard',
                href: route('dashboard'),
                icon: BarChart3,
            },
            {
                label: 'Produits',
                href: route('products.index'),
                icon: ShoppingBag,
            },
            {
                label: 'Mes commandes',
                href: route('client.orders.index'),
                icon: ClipboardList,
            },
            {
                label: 'Mon panier',
                href: route('cart'),
                icon: Box,
            },
            {
                label: 'Mes adresses',
                href: route('client.addresses.index'),
                icon: MapPin,
            },
            {
                label: 'Mon profil',
                href: route('client.profile.edit'),
                icon: UserRound,
            },
        ],

        livreur: [
            {
                label: 'Dashboard',
                href: route('livreur.dashboard'),
                icon: BarChart3,
            },
            {
                label: 'Mes livraisons',
                href: route('livreur.deliveries.index'),
                icon: Truck,
            },
        ],
    }

    const currentMenus = menus[role] || []

    const logout = () => {
        router.post(route('logout'))
    }

    const isActive = (href) => {
        const currentPath = window.location.pathname
        const targetPath = new URL(
            href,
            window.location.origin
        ).pathname

        if (
            targetPath === '/admin' ||
            targetPath === '/dashboard' ||
            targetPath === '/livreur'
        ) {
            return currentPath === targetPath
        }

        return (
            currentPath === targetPath ||
            currentPath.startsWith(`${targetPath}/`)
        )
    }

    const getHomeRoute = () => {
        if (role === 'admin') {
            return route('admin.dashboard')
        }

        if (role === 'livreur') {
            return route('livreur.dashboard')
        }

        return route('dashboard')
    }

    return (
        <div className="min-h-screen bg-muted/40">
            {}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                {}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <Link
                        href={getHomeRoute()}
                        className="text-xl font-bold"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Beauty Shop
                    </Link>

                    <button
                        type="button"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-medium">
                                {user?.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {roleLabels[role] || 'Utilisateur'}
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <nav className="space-y-1 p-4">
                    {currentMenus.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <Icon className="h-5 w-5" />

                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {}
                <div className="absolute bottom-0 w-full border-t p-4">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        <LogOut className="h-5 w-5" />

                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {}
            <div className="lg:pl-64">
                {}
                <header className="flex h-16 items-center border-b bg-background px-4 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-2 hover:bg-muted"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <span className="ml-4 font-semibold">
                        Beauty Shop
                    </span>
                </header>

                {}
                <main>{children}</main>
            </div>
        </div>
    )
}
