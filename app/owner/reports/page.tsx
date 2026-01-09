'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Order {
    id: number
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
    items: Array<{
        id: number
        quantity: number
        price: number
        menu: {
            name: string
        }
    }>
}

export default function OwnerReportsPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        checkAuth()
        fetchOrders()
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

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            const completedOrders = await res.json()
            setOrders(completedOrders.filter((o: Order) => o.status === 'COMPLETED'))
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async () => {
        setExporting(true)
        try {
            const res = await fetch('/api/owner/export')
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `sales-report-${Date.now()}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error exporting data:', error)
            alert('Failed to export data')
        } finally {
            setExporting(false)
        }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient mb-2">Sales Reports</h1>
                        <p className="text-gray-600">Detailed sales data and export</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || orders.length === 0}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {exporting ? 'Exporting...' : '📥 Export to CSV'}
                    </button>
                </div>

                {/* Summary */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <div className="text-3xl mb-2">💰</div>
                        <div className="text-4xl font-bold mb-2">
                            Rp {totalRevenue.toLocaleString('id-ID')}
                        </div>
                        <div className="text-green-100">Total Revenue (Completed Orders)</div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-3xl mb-2">📦</div>
                        <div className="text-4xl font-bold mb-2">{orders.length}</div>
                        <div className="text-blue-100">Completed Orders</div>
                    </div>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-xl text-gray-600">No completed orders yet</p>
                    </div>
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Customer</th>
                                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold">Items</th>
                                    <th className="px-4 py-3 text-right font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono font-semibold">#{order.id}</td>
                                        <td className="px-4 py-3">{order.customerName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {order.items.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.menu.name} x{item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600">
                                            Rp {order.totalAmount.toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
