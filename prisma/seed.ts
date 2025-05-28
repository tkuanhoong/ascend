import { PrismaClient } from '.prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "3D Modeling" },
                { name: "Engineering" },
                { name: "Statistics" },
                { name: "Data Science" },
                { name: "Web Development" },
                { name: "Artificial Intelligence" },
            ]
        });
    } catch (error) {
        console.log("Error seeding database categories", error);
    } finally {
        await prisma.$disconnect();
    }
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