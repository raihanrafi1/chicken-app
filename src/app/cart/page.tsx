'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartContext'
import Image from 'next/image'

export default function CartPage() {
    const router = useRouter()
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()

    const handleCheckout = () => {
        if (cart.length === 0) return
        router.push('/checkout')
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add some delicious chicken to your cart!</p>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold mb-8 text-gradient">Your Cart</h1>

                <div className="space-y-4 mb-8">
                    {cart.map((item, index) => (
                        <div key={`${item.menuId}-${index}`} className="card flex items-center gap-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                                🍗
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                {item.variant && (
                                    <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                                )}
                                <p className="text-orange-500 font-semibold mt-1">
                                    Rp {(item.price + (item.variantPrice || 0)).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                                    className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center font-bold"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.menuId)}
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Remove item"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Subtotal</span>
                        <span className="text-2xl font-bold">Rp {total.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={clearCart}
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="flex-1 bg-white text-orange-500 font-bold px-6 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            Checkout →
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
