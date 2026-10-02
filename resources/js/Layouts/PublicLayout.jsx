import { Link, router, usePage } from '@inertiajs/react'
import {
    LogOut,
    Menu,
    ShoppingBag,
    ShoppingCart,
    User,
    X,
} from 'lucide-react'
import { useState } from 'react'

import { useCart } from '@/contexts/CartContext'

export default function PublicLayout({ children }) {
    const { auth } = usePage().props

    const user = auth?.user

    const { getCartCount } = useCart()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const cartCount = getCartCount()

    const logout = () => {
        router.post(route('logout'))
    }

    const getDashboardRoute = () => {
        if (!user) {
            return route('login')
        }

        if (user.role === 'admin') {
            return route('admin.dashboard')
        }

        if (user.role === 'livreur') {
            return route('livreur.dashboard')
        }

        return route('dashboard')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <Link
                        href={route('home')}
                        className="flex items-center gap-2 text-xl font-bold"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ShoppingBag className="h-6 w-6" />

                        <span>Beauty Shop</span>
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href={route('home')}
                            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                        >
                            Accueil
                        </Link>

                        <Link
                            href={route('products.index')}
                            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                        >
                            Produits
                        </Link>
                    </nav>

                    {/* Actions desktop */}
                    <div className="hidden items-center gap-3 md:flex">

                        {/* Panier */}
                        <Link
                            href={route('cart')}
                            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            <ShoppingCart className="h-5 w-5" />

                            <span>Panier</span>

                            {cartCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!user ? (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                >
                                    Connexion
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >
                                    Inscription
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={getDashboardRoute()}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                >
                                    <User className="h-5 w-5" />

                                    <span>{user.name}</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    <LogOut className="h-5 w-5" />

                                    <span>Déconnexion</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Bouton mobile */}
                    <button
                        type="button"
                        className="rounded-md p-2 md:hidden"
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Menu mobile */}
                {mobileMenuOpen && (
                    <div className="border-t bg-background md:hidden">
                        <div className="space-y-1 px-4 py-4">

                            <Link
                                href={route('home')}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                            >
                                Accueil
                            </Link>

                            <Link
                                href={route('products.index')}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                            >
                                Produits
                            </Link>

                            <Link
                                href={route('cart')}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                            >
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />

                                    Panier
                                </span>

                                {cartCount > 0 && (
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {!user ? (
                                <>
                                    <Link
                                        href={route('login')}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                                    >
                                        Connexion
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                                    >
                                        Inscription
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={getDashboardRoute()}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                                    >
                                        <User className="h-5 w-5" />

                                        Mon espace
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                                    >
                                        <LogOut className="h-5 w-5" />

                                        Déconnexion
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Contenu */}
            <main>{children}</main>
        </div>
    )
}
