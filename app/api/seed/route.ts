
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
    try {
        // PASSWORD HASHING
        const staffPassword = await bcrypt.hash('admin123', 10)
        const ownerPassword = await bcrypt.hash('owner123', 10)

        // SEED USERS
        const staff = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: staffPassword,
                role: 'STAFF',
            },
        })

        const owner = await prisma.user.upsert({
            where: { username: 'owner' },
            update: {},
            create: {
                username: 'owner',
                password: ownerPassword,
                role: 'OWNER',
            },
        })

        // SEED MENU ITEMS with Real Images
        const menus = [
            {
                id: 1,
                name: 'Ayam Goreng Crispy',
                description: 'Ayam goreng renyah dengan bumbu rahasia',
                price: 25000,
                category: 'Fried Chicken',
                image: '/fried-chicken.png'
            },
            {
                id: 2,
                name: 'Ayam Pedas',
                description: 'Ayam goreng dengan bumbu pedas level maksimal',
                price: 28000,
                category: 'Fried Chicken',
                image: '/spicy-chicken.png'
            },
            {
                id: 3,
                name: 'Ayam Bakar',
                description: 'Ayam bakar dengan saus spesial',
                price: 30000,
                category: 'Grilled Chicken',
                image: '/grilled-chicken.png'
            },
            {
                id: 4,
                name: 'Chicken Burger',
                description: 'Burger dengan daging ayam crispy',
                price: 22000,
                category: 'Burgers',
                image: '/chicken-burger.png'
            },
            {
                id: 5,
                name: 'Nasi Ayam Komplit',
                description: 'Nasi dengan ayam goreng, sambal, dan lalapan',
                price: 35000,
                category: 'Rice Bowl',
                image: '/chicken-rice.jpg'
            }
        ]

        for (const menu of menus) {
            await prisma.menu.upsert({
                where: { id: menu.id },
                update: { image: menu.image },
                create: menu
            })
        }

        // SEED VARIANTS
        const friedChicken = await prisma.menu.findFirst({ where: { name: 'Ayam Goreng Crispy' } })
        if (friedChicken) {
            await prisma.variant.createMany({
                data: [
                    { name: 'Tidak Pedas', priceModifier: 0, menuId: friedChicken.id },
                    { name: 'Pedas Sedang', priceModifier: 2000, menuId: friedChicken.id },
                    { name: 'Extra Pedas', priceModifier: 3000, menuId: friedChicken.id },
                ],
                skipDuplicates: true
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Database Seeded Successfully! You can now login.',
            users: {
                staff: 'admin / admin123',
                owner: 'owner / owner123'
            }
        })

    } catch (error) {
        console.error('Seeding error:', error)
        return NextResponse.json({ success: false, error: 'Seeding failed. Check logs.' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
