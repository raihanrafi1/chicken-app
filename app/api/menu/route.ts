import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const menus = await prisma.menu.findMany({
            include: {
                variants: true,
            },
            orderBy: {
                category: 'asc',
            },
        })

        return NextResponse.json(menus)
    } catch (error) {
        console.error('Error fetching menus:', error)
        return NextResponse.json(
            { error: 'Failed to fetch menus' },
            { status: 500 }
        )
    }
}
