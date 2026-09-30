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
            return JSON.parse(savedCart)
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
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            )

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
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
                    stock: product.stock,
                    quantity: 1,
                },
            ]
        })
    }

    const increaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== productId) {
                    return item
                }

                if (item.quantity >= item.stock) {
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
                        quantity: item.quantity - 1,
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
                item.price * item.quantity,
            0
        )
    }

    const getCartCount = () => {
        return cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        )
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
