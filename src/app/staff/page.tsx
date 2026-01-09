'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function StaffDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalMenuItems: 0,
        activeDiscounts: 0,
    })

    useEffect(() => {
        checkAuth()
        fetchStats()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/session')
            const data = await res.json()

            if (!data.authenticated || data.user.role !== 'STAFF') {
                router.push('/login')
            }
        } catch (error) {
            router.push('/login')
        }
    }

    const fetchStats = async () => {
        try {
            const [ordersRes, menuRes, discountsRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/menu'),
                fetch('/api/staff/discounts'),
            ])

            const orders = await ordersRes.json()
            const menu = await menuRes.json()
            const discounts = await discountsRes.json()

            setStats({
                totalOrders: orders.length || 0,
                pendingOrders: orders.filter((o: any) => o.status === 'PENDING').length || 0,
                totalMenuItems: menu.length || 0,
                activeDiscounts: discounts.length || 0,
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gradient mb-2">Staff Dashboard</h1>
                    <p className="text-gray-600">Manage menu, discounts, and orders</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-3xl mb-2">📦</div>
                        <div className="text-3xl font-bold mb-1">{stats.totalOrders}</div>
                        <div className="text-blue-100">Total Orders</div>
                    </div>

                    <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="text-3xl mb-2">⏳</div>
                        <div className="text-3xl font-bold mb-1">{stats.pendingOrders}</div>
                        <div className="text-orange-100">Pending Orders</div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="text-3xl mb-2">🍗</div>
                        <div className="text-3xl font-bold mb-1">{stats.totalMenuItems}</div>
                        <div className="text-green-100">Menu Items</div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="text-3xl mb-2">🏷️</div>
                        <div className="text-3xl font-bold mb-1">{stats.activeDiscounts}</div>
                        <div className="text-purple-100">Active Discounts</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/staff/menu" className="card hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">🍽️</div>
                            <h3 className="text-xl font-bold mb-2">Manage Menu</h3>
                            <p className="text-gray-600">Add, edit, or remove menu items and variants</p>
                        </Link>

                        <Link href="/staff/discounts" className="card hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">💰</div>
                            <h3 className="text-xl font-bold mb-2">Manage Discounts</h3>
                            <p className="text-gray-600">Create and manage promotional discounts</p>
                        </Link>

                        <Link href="/staff/orders" className="card hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="text-xl font-bold mb-2">View Orders</h3>
                            <p className="text-gray-600">Process and update order statuses</p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
