import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function main() {
    // Create users
    const staffPassword = await bcrypt.hash('admin123', 10)
    const ownerPassword = await bcrypt.hash('owner123', 10)

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

    console.log('✓ Created users:', { staff: staff.username, owner: owner.username })

    // Create menu items
    const friedChicken = await prisma.menu.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Ayam Goreng Crispy',
            description: 'Ayam goreng renyah dengan bumbu rahasia',
            price: 25000,
            category: 'Fried Chicken',
        },
    })

    const spicyChicken = await prisma.menu.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Ayam Pedas',
            description: 'Ayam goreng dengan bumbu pedas level maksimal',
            price: 28000,
            category: 'Fried Chicken',
        },
    })

    const grilledChicken = await prisma.menu.upsert({
        where: { id: 3 },
        update: {},
        create: {
            name: 'Ayam Bakar',
            description: 'Ayam bakar dengan saus spesial',
            price: 30000,
            category: 'Grilled Chicken',
        },
    })

    const chickenBurger = await prisma.menu.upsert({
        where: { id: 4 },
        update: { image: '/chicken-burger.png' },
        create: {
            name: 'Chicken Burger',
            description: 'Burger dengan daging ayam crispy',
            price: 22000,
            category: 'Burgers',
            image: '/chicken-burger.png',
        },
    })

    const chickenRice = await prisma.menu.upsert({
        where: { id: 5 },
        update: { image: '/chicken-rice.png' },
        create: {
            name: 'Nasi Ayam Komplit',
            description: 'Nasi dengan ayam goreng, sambal, dan lalapan',
            price: 35000,
            category: 'Rice Bowl',
            image: '/chicken-rice.png',
        },
    })

    console.log('✓ Created menu items')

    // Create variants
    await prisma.variant.deleteMany({})

    await prisma.variant.createMany({
        data: [
            // Spicy levels
            { name: 'Tidak Pedas', priceModifier: 0, menuId: friedChicken.id },
            { name: 'Pedas Sedang', priceModifier: 2000, menuId: friedChicken.id },
            { name: 'Extra Pedas', priceModifier: 3000, menuId: friedChicken.id },

            // Sizes
            { name: 'Regular', priceModifier: 0, menuId: grilledChicken.id },
            { name: 'Large', priceModifier: 8000, menuId: grilledChicken.id },

            // Burger options
            { name: 'Single Patty', priceModifier: 0, menuId: chickenBurger.id },
            { name: 'Double Patty', priceModifier: 12000, menuId: chickenBurger.id },
        ],
    })

    console.log('✓ Created variants')

    // Create discounts
    await prisma.discount.deleteMany({})

    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    await prisma.discount.createMany({
        data: [
            {
                name: 'Promo Weekend',
                percentage: 15,
                startDate: now,
                endDate: nextMonth,
            },
            {
                name: 'Diskon Member',
                percentage: 10,
                startDate: now,
                endDate: nextMonth,
            },
            {
                name: 'Flash Sale',
                percentage: 25,
                startDate: now,
                endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
            },
        ],
    })

    console.log('✓ Created discounts')
    console.log('🎉 Seeding completed successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
