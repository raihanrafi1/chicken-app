'use client'

import Image from 'next/image'

interface MenuCardProps {
    id: number
    name: string
    description?: string
    price: number
    image?: string
    category: string
    onAddToCart?: () => void
    onViewDetails?: () => void
}

export default function MenuCard({
    name,
    description,
    price,
    image,
    category,
    onAddToCart,
    onViewDetails,
}: MenuCardProps) {
    return (
        <div className="card group cursor-pointer" onClick={onViewDetails}>
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl mb-4 overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        🍗
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-600">
                    {category}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition-colors">
                    {name}
                </h3>

                {description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                )}

                <div className="flex items-center justify-between pt-3">
                    <div className="text-2xl font-bold text-orange-500">
                        Rp {price.toLocaleString('id-ID')}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart?.()
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}
