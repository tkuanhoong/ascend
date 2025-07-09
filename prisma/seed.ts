import { PrismaClient, UserRole } from '.prisma/client'
import { hashPassword } from '@/lib/hash';
const prisma = new PrismaClient()

async function main() {
    try {
        const hashedPassword = await hashPassword("123456");
        await prisma.user.createMany({
            data: [
                {
                    name: "Student",
                    identificationNo: '011111015541',
                    email: "student@gmail.com",
                    emailVerified: new Date(),
                    password: hashedPassword,
                    role: UserRole.USER
                },
                // {
                //     name: "TAN KUAN HOONG",
                //     identificationNo: '011201012943',
                //     email: "tkuanhoong@gmail.com",
                //     emailVerified: new Date(),
                //     password: hashedPassword,
                //     role: UserRole.USER
                // },
                {
                    name: "Creator",
                    identificationNo: '011201011011',
                    email: "creator@gmail.com",
                    emailVerified: new Date(),
                    password: hashedPassword,
                    role: UserRole.USER
                },
                {
                    name: "Admin",
                    identificationNo: '011124015582',
                    email: "admin@gmail.com",
                    emailVerified: new Date(),
                    password: hashedPassword,
                    role: UserRole.ADMIN
                },
            ]
        });
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
        console.log("Error seeding database", error);
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