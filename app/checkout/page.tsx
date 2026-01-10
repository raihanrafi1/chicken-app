'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartContext'

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, total, clearCart } = useCart()
    const [customerName, setCustomerName] = useState('')
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            router.push('/cart')
        }
    }, [cart.length, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    items: cart,
                    totalAmount: total,
                    paymentMethod,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                clearCart()
                router.push(`/order/${data.orderId}`)
            } else {
                alert('Order failed. Please try again.')
                setLoading(false)
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    // Show nothing while redirecting
    if (cart.length === 0) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold mb-8 text-gradient">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6">Your Information</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Payment Method (Simulated)
                                </label>
                                <div className="space-y-2">
                                    {['cash', 'credit-card', 'e-wallet'].map((method) => (
                                        <label key={method} className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method}
                                                checked={paymentMethod === method}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-orange-500"
                                            />
                                            <span className="font-medium capitalize">{method.replace('-', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white h-fit">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            {cart.map((item, index) => (
                                <div key={`${item.menuId}-${index}`} className="flex justify-between text-sm">
                                    <span>
                                        {item.name} {item.variant && `(${item.variant})`} x{item.quantity}
                                    </span>
                                    <span className="font-semibold">
                                        Rp {((item.price + (item.variantPrice || 0)) * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/30 pt-4">
                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span>Total</span>
                                <span>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
