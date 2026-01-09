'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Discount {
    id: number
    name: string
    percentage: number
    startDate: string
    endDate: string
}

export default function StaffDiscountsPage() {
    const router = useRouter()
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        percentage: '',
        startDate: '',
        endDate: '',
    })

    useEffect(() => {
        checkAuth()
        fetchDiscounts()
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

    const fetchDiscounts = async () => {
        try {
            const res = await fetch('/api/staff/discounts')
            const data = await res.json()
            setDiscounts(data)
        } catch (error) {
            console.error('Error fetching discounts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/staff/discounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setShowForm(false)
                setFormData({ name: '', percentage: '', startDate: '', endDate: '' })
                fetchDiscounts()
            }
        } catch (error) {
            console.error('Error creating discount:', error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this discount?')) return

        try {
            const res = await fetch(`/api/staff/discounts?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchDiscounts()
            }
        } catch (error) {
            console.error('Error deleting discount:', error)
        }
    }

    const isActive = (discount: Discount) => {
        const now = new Date()
        const start = new Date(discount.startDate)
        const end = new Date(discount.endDate)
        return now >= start && now <= end
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient">Discount Management</h1>
                        <p className="text-gray-600">Create and manage promotional discounts</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true)
                            setFormData({ name: '', percentage: '', startDate: '', endDate: '' })
                        }}
                        className="btn-primary"
                    >
                        + Add New Discount
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-lg w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Add New Discount</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Flash Sale"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Percentage (%) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.percentage}
                                        onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                                        className="input-field"
                                        min="1"
                                        max="100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary flex-1">
                                        Create Discount
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Discounts List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : discounts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏷️</div>
                        <p className="text-xl text-gray-600">No discounts created yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {discounts.map((discount) => (
                            <div key={discount.id} className={`card ${isActive(discount) ? 'border-2 border-green-500' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-xl">{discount.name}</h3>
                                    {isActive(discount) && (
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div className="text-5xl font-bold text-orange-500 mb-4">
                                    {discount.percentage}%
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p>
                                        <span className="font-semibold">Start:</span>{' '}
                                        {new Date(discount.startDate).toLocaleString('id-ID')}
                                    </p>
                                    <p>
                                        <span className="font-semibold">End:</span>{' '}
                                        {new Date(discount.endDate).toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(discount.id)}
                                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
