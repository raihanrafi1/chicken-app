import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

function OrderSuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/')
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="animate-slide-up">
                {/* Success Icon */}
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl animate-bounce">
                    ✓
                </div>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Order Placed Successfully!
                </h1>

                <p className="text-xl text-gray-600 mb-2">
                    Thank you for your order!
                </p>

                {orderId && (
                    <p className="text-lg text-gray-500 mb-8">
                        Order ID: <span className="font-mono font-semibold text-green-600">#{orderId}</span>
                    </p>
                )}

                <div className="card max-w-md mx-auto mb-8">
                    <div className="text-6xl mb-4">🍗</div>
                    <p className="text-gray-600">
                        Your delicious chicken order is being prepared!
                    </p>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Redirecting to homepage in {countdown} seconds...
                </p>

                <button
                    onClick={() => router.push('/')}
                    className="btn-primary"
                >
                    Back to Home
                </button>
            </div>
        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            <Navbar />
            <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
        </div>
    )
}
