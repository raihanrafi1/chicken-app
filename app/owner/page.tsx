'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Analytics {
    summary: {
        totalRevenue: number
        totalOrders: number
        completedOrders: number
        pendingOrders: number
        averageOrderValue: number
    }
    revenueByDay: Array<{
        date: string
        revenue: number
        orders: number
    }>
    popularItems: Array<{
        name: string
        count: number
        revenue: number
    }>
}

export default function OwnerDashboard() {
    const router = useRouter()
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
        fetchAnalytics()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/session')
            const data = await res.json()

            if (!data.authenticated || data.user.role !== 'OWNER') {
                router.push('/login')
            }
        } catch (error) {
            router.push('/login')
        }
    }

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/owner/analytics')
            const data = await res.json()
            setAnalytics(data)
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !analytics) {
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
                    <h1 className="text-4xl font-bold text-gradient mb-2">Owner Dashboard</h1>
                    <p className="text-gray-600">Sales analytics and business insights</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <div className="text-2xl mb-2">💰</div>
                        <div className="text-3xl font-bold mb-1">
                            Rp {analytics.summary.totalRevenue.toLocaleString('id-ID')}
                        </div>
                        <div className="text-green-100">Total Revenue</div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-2xl mb-2">📦</div>
                        <div className="text-3xl font-bold mb-1">{analytics.summary.totalOrders}</div>
                        <div className="text-blue-100">Total Orders</div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="text-2xl mb-2">✅</div>
                        <div className="text-3xl font-bold mb-1">{analytics.summary.completedOrders}</div>
                        <div className="text-purple-100">Completed Orders</div>
                    </div>

                    <div className="card bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-2xl font-bold mb-1">
                            Rp {Math.round(analytics.summary.averageOrderValue).toLocaleString('id-ID')}
                        </div>
                        <div className="text-orange-100">Avg Order Value</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Trend */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6">Revenue Trend (Last 7 Days)</h2>
                        <div className="space-y-3">
                            {analytics.revenueByDay.map((day, index) => {
                                const maxRevenue = Math.max(...analytics.revenueByDay.map((d) => d.revenue))
                                const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0

                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{day.date}</span>
                                            <span className="text-gray-600">
                                                Rp {day.revenue.toLocaleString('id-ID')} ({day.orders} orders)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6">Top Selling Items</h2>
                        <div className="space-y-4">
                            {analytics.popularItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {item.count} sold • Rp {item.revenue.toLocaleString('id-ID')} revenue
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="card bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Need more details?</h2>
                            <p className="text-orange-100">View comprehensive reports and export data</p>
                        </div>
                        <button
                            onClick={() => router.push('/owner/reports')}
                            className="bg-white text-orange-500 px-8 py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            View Reports →
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
