'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed')
                setLoading(false)
                return
            }

            // Redirect based on role
            if (data.role === 'STAFF') {
                router.push('/staff')
            } else if (data.role === 'OWNER') {
                router.push('/owner')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8 animate-slide-up">
                    <div className="inline-block w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mb-4 shadow-xl transform hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl">🍗</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gradient mb-2">ChickenApp</h1>
                    <p className="text-gray-600">Admin & Owner Login</p>
                </div>

                {/* Login Form */}
                <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-3 font-medium">Demo Credentials:</p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-orange-50 p-3 rounded-lg">
                                <p className="font-semibold text-orange-700 mb-1">Staff Admin</p>
                                <p className="text-gray-600">Username: admin</p>
                                <p className="text-gray-600">Password: admin123</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg">
                                <p className="font-semibold text-amber-700 mb-1">Owner</p>
                                <p className="text-gray-600">Username: owner</p>
                                <p className="text-gray-600">Password: owner123</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        ← Back to Customer Menu
                    </button>
                </div>
            </div>
        </div>
    )
}
