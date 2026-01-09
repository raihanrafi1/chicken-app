'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Menu {
    id: number
    name: string
    description?: string
    price: number
    category: string
    image?: string
}

export default function StaffMenuPage() {
    const router = useRouter()
    const [menus, setMenus] = useState<Menu[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
    })

    useEffect(() => {
        checkAuth()
        fetchMenus()
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

    const fetchMenus = async () => {
        try {
            const res = await fetch('/api/menu')
            const data = await res.json()
            setMenus(data)
        } catch (error) {
            console.error('Error fetching menus:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = '/api/staff/menu'
            const method = editingMenu ? 'PUT' : 'POST'
            const body = editingMenu
                ? { id: editingMenu.id, ...formData }
                : formData

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setShowForm(false)
                setEditingMenu(null)
                setFormData({ name: '', description: '', price: '', category: '', image: '' })
                fetchMenus()
            }
        } catch (error) {
            console.error('Error saving menu:', error)
        }
    }

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu)
        setFormData({
            name: menu.name,
            description: menu.description || '',
            price: menu.price.toString(),
            category: menu.category,
            image: menu.image || '',
        })
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return

        try {
            const res = await fetch(`/api/staff/menu?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchMenus()
            }
        } catch (error) {
            console.error('Error deleting menu:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient">Menu Management</h1>
                        <p className="text-gray-600">Add, edit, or remove menu items</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true)
                            setEditingMenu(null)
                            setFormData({ name: '', description: '', price: '', category: '', image: '' })
                        }}
                        className="btn-primary"
                    >
                        + Add New Item
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}
                                </h2>
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
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="Fried Chicken">Fried Chicken</option>
                                        <option value="Grilled Chicken">Grilled Chicken</option>
                                        <option value="Burgers">Burgers</option>
                                        <option value="Rice Bowl">Rice Bowl</option>
                                        <option value="Sides">Sides</option>
                                        <option value="Beverages">Beverages</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="input-field"
                                        placeholder="/images/chicken.jpg"
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
                                        {editingMenu ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Menu List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menus.map((menu) => (
                            <div key={menu.id} className="card">
                                <div className="h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl mb-4 flex items-center justify-center text-5xl">
                                    🍗
                                </div>

                                <h3 className="font-bold text-lg mb-1">{menu.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {menu.description || 'No description'}
                                </p>
                                <p className="text-xs text-gray-500 mb-3">Category: {menu.category}</p>
                                <p className="text-2xl font-bold text-orange-500 mb-4">
                                    Rp {menu.price.toLocaleString('id-ID')}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(menu)}
                                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(menu.id)}
                                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
