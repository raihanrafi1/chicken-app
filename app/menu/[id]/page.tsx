'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartContext'

interface Menu {
    id: number
    name: string
    description?: string
    price: number
    image?: string
    category: string
    variants: Array<{
        id: number
        name: string
        priceModifier: number
    }>
}

export default function MenuDetailPage() {
    const router = useRouter()
    const params = useParams()
    const { addToCart } = useCart()
    const [menu, setMenu] = useState<Menu | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        fetchMenu()
    }, [params.id])

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/menu')
            const data = await res.json()
            const menuItem = data.find((m: Menu) => m.id === parseInt(params.id as string))
            setMenu(menuItem || null)

            // Select first variant by default if available
            if (menuItem?.variants && menuItem.variants.length > 0) {
                setSelectedVariant(menuItem.variants[0].id)
            }
        } catch (error) {
            console.error('Error fetching menu:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!menu) return

        const variant = menu.variants.find((v) => v.id === selectedVariant)

        addToCart({
            menuId: menu.id,
            name: menu.name,
            price: menu.price,
            quantity,
            variant: variant?.name,
            variantPrice: variant?.priceModifier || 0,
        })

        // Redirect to cart
        router.push('/cart')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (!menu) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="text-8xl mb-6">😢</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Menu Not Found</h2>
                    <button onClick={() => router.push('/')} className="btn-primary">
                        Back to Menu
                    </button>
                </div>
            </div>
        )
    }

    const totalPrice = menu.price + (menu.variants.find((v) => v.id === selectedVariant)?.priceModifier || 0)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-gray-600 hover:text-orange-500 flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl overflow-hidden">
                        {menu.image ? (
                            <Image
                                src={menu.image}
                                alt={menu.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-9xl">
                                🍗
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                            {menu.category}
                        </span>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{menu.name}</h1>

                        {menu.description && (
                            <p className="text-lg text-gray-600 mb-6">{menu.description}</p>
                        )}

                        <div className="text-4xl font-bold text-orange-500 mb-8">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </div>

                        {/* Variants */}
                        {menu.variants && menu.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Choose Variant:</h3>
                                <div className="space-y-3">
                                    {menu.variants.map((variant) => (
                                        <label
                                            key={variant.id}
                                            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedVariant === variant.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="variant"
                                                    value={variant.id}
                                                    checked={selectedVariant === variant.id}
                                                    onChange={() => setSelectedVariant(variant.id)}
                                                    className="w-5 h-5 text-orange-500"
                                                />
                                                <span className="font-medium">{variant.name}</span>
                                            </div>
                                            {variant.priceModifier > 0 && (
                                                <span className="text-orange-500 font-semibold">
                                                    +Rp {variant.priceModifier.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Quantity:</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-xl"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="btn-primary w-full text-lg py-4"
                        >
                            Add to Cart - Rp {(totalPrice * quantity).toLocaleString('id-ID')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
