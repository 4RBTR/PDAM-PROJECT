import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        console.log("🌱 Mulai mengisi data akun melalui API Route...");

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

        return NextResponse.json({
            status: true,
            data: { kasir, manager, pelanggan },
            message: "Sedding database successful!"
        });
    } catch (e) {
        return NextResponse.json({ status: false, error: String(e) }, { status: 500 });
    }
}
