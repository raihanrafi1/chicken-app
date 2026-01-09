const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateMenuImages() {
    try {
        // Mapping common menu names to their images
        const imageMap = {
            'Ayam Goreng Crispy': '/crispy-chicken.png',
            'Chicken Wings': '/spicy-wings.png',
            'Ayam Bakar': '/grilled-chicken.png',
            'Chicken Nuggets': '/chicken-nuggets.png',
        }

        // Get all menu items
        const menus = await prisma.menu.findMany()

        console.log('Updating menu images...')

        for (const menu of menus) {
            // Try to match by exact name first
            let imagePath = imageMap[menu.name]

            // If no exact match, try to match by keywords
            if (!imagePath) {
                if (menu.name.toLowerCase().includes('crispy') || menu.name.toLowerCase().includes('goreng')) {
                    imagePath = '/crispy-chicken.png'
                } else if (menu.name.toLowerCase().includes('wing')) {
                    imagePath = '/spicy-wings.png'
                } else if (menu.name.toLowerCase().includes('bakar') || menu.name.toLowerCase().includes('grill')) {
                    imagePath = '/grilled-chicken.png'
                } else if (menu.name.toLowerCase().includes('nugget')) {
                    imagePath = '/chicken-nuggets.png'
                } else {
                    // Default to crispy chicken for any other chicken items
                    imagePath = '/crispy-chicken.png'
                }
            }

            // Update the menu item
            await prisma.menu.update({
                where: { id: menu.id },
                data: { image: imagePath }
            })

            console.log(`✓ Updated ${menu.name} with image: ${imagePath}`)
        }

        console.log('\n✅ All menu images updated successfully!')
    } catch (error) {
        console.error('Error updating menu images:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateMenuImages()
