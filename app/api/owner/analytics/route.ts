import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
    try {
        await requireAuth('OWNER')

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

        // Calculate analytics
        const totalRevenue = orders
            .filter((o) => o.status === 'COMPLETED')
            .reduce((sum, o) => sum + o.totalAmount, 0)

        const totalOrders = orders.length
        const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length
        const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

        // Revenue by day (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)
            return date
        }).reverse()

        const revenueByDay = last7Days.map((date) => {
            const nextDay = new Date(date)
            nextDay.setDate(nextDay.getDate() + 1)

            const dayOrders = orders.filter((o) => {
                const orderDate = new Date(o.createdAt)
                return orderDate >= date && orderDate < nextDay && o.status === 'COMPLETED'
            })

            return {
                date: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                orders: dayOrders.length,
            }
        })

        // Most popular items
        const itemCounts = new Map<number, { name: string; count: number; revenue: number }>()

        orders
            .filter((o) => o.status === 'COMPLETED')
            .forEach((order) => {
                order.items.forEach((item) => {
                    const existing = itemCounts.get(item.menuId) || {
                        name: item.menu.name,
                        count: 0,
                        revenue: 0,
                    }
                    itemCounts.set(item.menuId, {
                        name: item.menu.name,
                        count: existing.count + item.quantity,
                        revenue: existing.revenue + item.price * item.quantity,
                    })
                })
            })

        const popularItems = Array.from(itemCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalOrders,
                completedOrders,
                pendingOrders,
                averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
            },
            revenueByDay,
            popularItems,
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
