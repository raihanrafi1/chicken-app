
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import Navbar from '@/components/Navbar'

const prisma = new PrismaClient()

async function getOrder(id: string) {
    const orderId = parseInt(id)
    if (isNaN(orderId)) return null

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        }
    })

    return order
}

export default async function OrderReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrder(id)

    if (!order) {
        notFound()
    }

    // Generate QR Data (Simulated Payment QRIS String)
    const qrData = `00020101021226660014ID.GO.GOPAY.WWW01189360091431234567890215ID12345678901230303UMI51440014ID.CO.QRIS.WWW0215ID10200300400500303UMI5204581253033605802ID5911CHICKENAPP6006JAKARTA61051234562070703A01630489AB`

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="max-w-xl mx-auto px-4 pt-10">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative jagged edge for receipt look */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-orange-500"></div>

                    <div className="text-center mb-8 mt-4">
                        <h1 className="text-3xl font-bold text-gray-800">ChickenApp</h1>
                        <p className="text-gray-500 text-sm">Receipt & Payment</p>
                        <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                            {order.status}
                        </div>
                    </div>

                    {/* Receipt Items */}
                    <div className="border-t border-b border-dashed border-gray-300 py-6 my-6 space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {item.menu.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                                    </p>
                                    {/* You might want to store variant name in OrderItem to display it here if needed */}
                                </div>
                                <p className="font-mono text-gray-600">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-8">
                        <span>Total</span>
                        <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center mb-8">
                        <p className="text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wider">Scan to Pay</p>
                        <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
                            <QRCode
                                value={qrData}
                                size={200}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Accepts All E-Wallets (QRIS)</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            Back to Menu
                        </Link>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Saved Order ID: #{order.id}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
