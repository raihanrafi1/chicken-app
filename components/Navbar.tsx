'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from './CartContext'

export default function Navbar() {
    const pathname = usePathname()
    const { cart } = useCart()

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const isAuthPage = pathname === '/login'
    const isStaffPage = pathname?.startsWith('/staff')
    const isOwnerPage = pathname?.startsWith('/owner')

    if (isAuthPage) return null

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-xl">🍗</span>
                        </div>
                        <span className="font-bold text-xl text-gradient">ChickenApp</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        {isStaffPage ? (
                            <>
                                <Link href="/staff" className={`text-sm font-medium transition-colors ${pathname === '/staff' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Dashboard
                                </Link>
                                <Link href="/staff/menu" className={`text-sm font-medium transition-colors ${pathname === '/staff/menu' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Menu
                                </Link>
                                <Link href="/staff/discounts" className={`text-sm font-medium transition-colors ${pathname === '/staff/discounts' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Discounts
                                </Link>
                                <Link href="/staff/orders" className={`text-sm font-medium transition-colors ${pathname === '/staff/orders' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Orders
                                </Link>
                                <button
                                    onClick={async () => {
                                        await fetch('/api/auth/logout', { method: 'POST' })
                                        window.location.href = '/login'
                                    }}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : isOwnerPage ? (
                            <>
                                <Link href="/owner" className={`text-sm font-medium transition-colors ${pathname === '/owner' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Dashboard
                                </Link>
                                <Link href="/owner/reports" className={`text-sm font-medium transition-colors ${pathname === '/owner/reports' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Reports
                                </Link>
                                <button
                                    onClick={async () => {
                                        await fetch('/api/auth/logout', { method: 'POST' })
                                        window.location.href = '/login'
                                    }}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>
                                    Menu
                                </Link>
                                <Link href="/cart" className="relative">
                                    <button className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </button>
                                </Link>
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                                    Admin Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
