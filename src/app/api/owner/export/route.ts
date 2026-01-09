import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
    try {
        await requireAuth('OWNER')

        const orders = await prisma.order.findMany({
            where: {
                status: 'COMPLETED',
            },
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

        // Convert to CSV format
        const csvRows = [
            'Order ID,Customer Name,Date,Total Amount,Items',
        ]

        orders.forEach((order) => {
            const items = order.items
                .map((item) => `${item.menu.name} (${item.quantity}x)`)
                .join('; ')

            csvRows.push(
                `${order.id},${order.customerName},${new Date(order.createdAt).toLocaleDateString('id-ID')},${order.totalAmount},"${items}"`
            )
        })

        const csvContent = csvRows.join('\n')

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="sales-report-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Error exporting data:', error)
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        )
    }
}
