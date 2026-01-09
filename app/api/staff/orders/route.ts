import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request: NextRequest) {
    try {
        await requireAuth('STAFF')

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const { status } = await request.json()

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            )
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}
