import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
    try {
        const discounts = await prisma.discount.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(discounts)
    } catch (error) {
        console.error('Error fetching discounts:', error)
        return NextResponse.json(
            { error: 'Failed to fetch discounts' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAuth('STAFF')

        const { name, percentage, startDate, endDate } = await request.json()

        if (!name || !percentage || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const discount = await prisma.discount.create({
            data: {
                name,
                percentage,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        })

        return NextResponse.json(discount)
    } catch (error) {
        console.error('Error creating discount:', error)
        return NextResponse.json(
            { error: 'Failed to create discount' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireAuth('STAFF')

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Discount ID required' },
                { status: 400 }
            )
        }

        await prisma.discount.delete({
            where: { id: parseInt(id) },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting discount:', error)
        return NextResponse.json(
            { error: 'Failed to delete discount' },
            { status: 500 }
        )
    }
}
