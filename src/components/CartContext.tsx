'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
    menuId: number
    name: string
    price: number
    quantity: number
    variant?: string
    variantPrice?: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (menuId: number) => void
    updateQuantity: (menuId: number, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.menuId === item.menuId && i.variant === item.variant)
            if (existing) {
                return prev.map((i) =>
                    i.menuId === item.menuId && i.variant === item.variant
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                )
            }
            return [...prev, item]
        })
    }

    const removeFromCart = (menuId: number) => {
        setCart((prev) => prev.filter((i) => i.menuId !== menuId))
    }

    const updateQuantity = (menuId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(menuId)
            return
        }
        setCart((prev) =>
            prev.map((i) => (i.menuId === menuId ? { ...i, quantity } : i))
        )
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem('cart')
    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price + (item.variantPrice || 0)) * item.quantity,
        0
    )

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
