import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        await requireAuth('STAFF')

        const { name, description, price, category, image } = await request.json()

        if (!name || !price || !category) {
            return NextResponse.json(
                { error: 'Name, price, and category are required' },
                { status: 400 }
            )
        }

        const menu = await prisma.menu.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                image,
            },
        })

        return NextResponse.json(menu)
    } catch (error) {
        console.error('Error creating menu:', error)
        return NextResponse.json(
            { error: 'Failed to create menu item' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requireAuth('STAFF')

        const { id, name, description, price, category, image } = await request.json()

        if (!id) {
            return NextResponse.json(
                { error: 'Menu ID required' },
                { status: 400 }
            )
        }

        const menu = await prisma.menu.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                category,
                image,
            },
        })

        return NextResponse.json(menu)
    } catch (error) {
        console.error('Error updating menu:', error)
        return NextResponse.json(
            { error: 'Failed to update menu item' },
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
                { error: 'Menu ID required' },
                { status: 400 }
            )
        }

        // Delete related variants first
        await prisma.variant.deleteMany({
            where: { menuId: parseInt(id) },
        })

        // Then delete menu
        await prisma.menu.delete({
            where: { id: parseInt(id) },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting menu:', error)
        return NextResponse.json(
            { error: 'Failed to delete menu item' },
            { status: 500 }
        )
    }
}
