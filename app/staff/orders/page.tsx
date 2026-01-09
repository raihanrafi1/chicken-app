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
            id: number
            name: string
        }
    }>
}

export default function StaffOrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('ALL')

    useEffect(() => {
        checkAuth()
        fetchOrders()
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

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/staff/orders?id=${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (res.ok) {
                fetchOrders()
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter((o) => o.status === filter)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-300'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gradient mb-2">Order Management</h1>
                    <p className="text-gray-600">Manage and process customer orders</p>
                </div>

                {/* Filter */}
                <div className="flex gap-3 mb-8">
                    {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === status
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl text-gray-600">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="card">
                                <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">
                                            Order #{order.id}
                                        </h3>
                                        <p className="text-gray-600">{order.customerName}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-500">
                                            Rp {order.totalAmount.toLocaleString('id-ID')}
                                        </p>
                                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border mt-2 ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <h4 className="font-semibold mb-3">Order Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>
                                                    {item.menu.name} x{item.quantity}
                                                </span>
                                                <span className="font-semibold">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status === 'PENDING' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                        >
                                            Mark as Completed
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
