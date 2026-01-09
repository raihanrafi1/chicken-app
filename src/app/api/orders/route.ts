import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { customerName, items, totalAmount } = await request.json()

        if (!customerName || !items || !totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                customerName,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        menuId: item.menuId,
                        quantity: item.quantity,
                        price: item.price + (item.variantPrice || 0),
                    })),
                },
            },
            include: {
                items: true,
            },
        })

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        menu: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
