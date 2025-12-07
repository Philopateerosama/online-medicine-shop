import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@medconnect.com' } });
    console.log('Admin User:', admin);
    await prisma.$disconnect();
}

main();
