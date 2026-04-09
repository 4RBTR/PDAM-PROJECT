import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Mulai mengisi data akun...");

    // 1. DATA KASIR
    const passwordKasir = await bcrypt.hash("321", 10);
    const kasir = await prisma.user.upsert({
        where: { email: 'andra@gmail.com' },
        update: {},
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

    // 3. DATA PELANGGAN
    const passwordPelanggan = await bcrypt.hash("123", 10);
    const pelanggan = await prisma.user.upsert({
        where: { email: 'pelanggan@gmail.com' },
        update: {},
        create: {
            name: "Budi Pelanggan",
            email: "pelanggan@gmail.com",
            password: passwordPelanggan,
            address: "Perumahan Indah",
            role: "PELANGGAN"
        },
    });
    console.log(`✅ Akun Pelanggan Siap: ${pelanggan.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
