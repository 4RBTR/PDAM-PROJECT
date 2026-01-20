// backend-pdam/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Pastikan package ini ada (biasanya sudah ada dari index.js)

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Mulai mengisi data admin...");

    // 1. DATA KASIR
    const passwordKasir = await bcrypt.hash("321", 10);
    const kasir = await prisma.user.upsert({
        where: { email: 'andra@gmail.com' },
        update: {}, // Jika sudah ada, jangan diapa-apakan
        create: {
            name: "Andra Kasir",
            email: "andra@gmail.com",
            password: passwordKasir,
            address: "Loket Pusat PDAM",
            role: "KASIR"
        },
    });
    console.log(`✅ Akun Kasir Siap: ${kasir.email}`);

    // 2. DATA MANAGER
    const passwordManager = await bcrypt.hash("54321", 10);
    const manager = await prisma.user.upsert({
        where: { email: 'danendra@gmail.com' },
        update: {},
        create: {
            name: "Danendra Manager",
            email: "danendra@gmail.com",
            password: passwordManager,
            address: "Ruang Direksi PDAM",
            role: "MANAGER"
        },
    });
    console.log(`✅ Akun Manager Siap: ${manager.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });