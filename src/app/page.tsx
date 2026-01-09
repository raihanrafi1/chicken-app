'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import MenuCard from '@/components/MenuCard'
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

export default function Home() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setMenus(data)

      // Extract unique categories
      const uniqueCategories: string[] = ['All', ...(Array.from(new Set(data.map((m: Menu) => m.category))) as string[])]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMenus = selectedCategory === 'All'
    ? menus
    : menus.filter((m) => m.category === selectedCategory)

  const handleQuickAdd = (menu: Menu) => {
    addToCart({
      menuId: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Banner Image */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl animate-slide-up">
          <Image
            src="/hero-banner.png"
            alt="Delicious Chicken Dishes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
            <div className="p-8 text-white w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                Delicious Chicken
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Nikmati ayam goreng terbaik dengan berbagai pilihan menu yang menggugah selera
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Our Menu Selection</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih dari berbagai varian ayam berkualitas premium
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${selectedCategory === category
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍗</div>
            <p className="text-xl text-gray-600">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                id={menu.id}
                name={menu.name}
                description={menu.description}
                price={menu.price}
                image={menu.image}
                category={menu.category}
                onAddToCart={() => {
                  if (menu.variants && menu.variants.length > 0) {
                    router.push(`/menu/${menu.id}`)
                  } else {
                    handleQuickAdd(menu)
                  }
                }}
                onViewDetails={() => router.push(`/menu/${menu.id}`)}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 text-white animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold mb-4">Hungry? Order Now!</h2>
          <p className="text-lg mb-6 opacity-90">
            Pesan sekarang dan nikmati ayam goreng crispy dengan harga spesial
          </p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            View Cart
          </button>
        </div>
      </main>
    </div>
  )
}
