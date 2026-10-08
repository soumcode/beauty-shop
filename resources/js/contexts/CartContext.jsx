import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'beauty_shop_cart'

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window === 'undefined') {
            return []
        }

        const savedCart =
            localStorage.getItem(CART_STORAGE_KEY)

        if (!savedCart) {
            return []
        }

        try {
            const parsedCart = JSON.parse(savedCart)

            if (!Array.isArray(parsedCart)) {
                return []
            }

            return parsedCart
                .filter((item) => {
                    return (
                        item &&
                        Number(item.id) > 0 &&
                        Number(item.stock) > 0 &&
                        Number(item.quantity) > 0
                    )
                })
                .map((item) => {
                    const stock = Number(item.stock)
                    const quantity = Math.min(
                        Number(item.quantity) || 1,
                        stock
                    )

                    return {
                        ...item,
                        id: Number(item.id),
                        price: Number(item.price) || 0,
                        stock,
                        quantity,
                    }
                })
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cartItems)
        )
    }, [cartItems])

    const addToCart = (product) => {
        const stock = Number(product.stock) || 0

        if (stock <= 0) {
            return false
        }

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            )

            if (existingItem) {
                if (
                    existingItem.quantity >= stock
                ) {
                    return currentItems
                }

                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              price: Number(
                                  product.price
                              ),
                              stock,
                              quantity:
                                  item.quantity + 1,
                          }
                        : item
                )
            }

            return [
                ...currentItems,
                {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    image: product.image,
                    stock,
                    quantity: 1,
                },
            ]
        })

        return true
    }

    const increaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== productId) {
                    return item
                }

                const stock = Number(item.stock) || 0

                if (
                    stock <= 0 ||
                    item.quantity >= stock
                ) {
                    return item
                }

                return {
                    ...item,
                    quantity: item.quantity + 1,
                }
            })
        )
    }

    const decreaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) => {
                    if (item.id !== productId) {
                        return item
                    }

                    return {
                        ...item,
                        quantity:
                            item.quantity - 1,
                    }
                })
                .filter(
                    (item) => item.quantity > 0
                )
        )
    }

    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== productId
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                    Number(item.quantity),
            0
        )
    }

    const getCartCount = () => {
        return cartItems.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        )
    }

    const hasInvalidStock = () => {
        return cartItems.some((item) => {
            const stock = Number(item.stock) || 0
            const quantity =
                Number(item.quantity) || 0

            return (
                stock <= 0 ||
                quantity > stock
            )
        })
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                getCartTotal,
                getCartCount,
                hasInvalidStock,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error(
            'useCart doit être utilisé à l’intérieur de CartProvider.'
        )
    }

    return context
}
