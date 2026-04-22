import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("🌱 Mulai mengisi data akun via RAW PG...");

        const now = new Date();

        // 1. DATA KASIR
        let res = await client.query('SELECT id FROM "User" WHERE email = $1', ['andra@gmail.com']);
        if (res.rowCount === 0) {
            const passwordKasir = await bcrypt.hash("321", 10);
            await client.query(
                'INSERT INTO "User" (name, email, password, address, role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
                ["Andra Kasir", "andra@gmail.com", passwordKasir, "Loket Pusat PDAM", "KASIR", now]
            );
            console.log(`✅ Akun Kasir Siap: andra@gmail.com`);
        } else {
            console.log(`✅ Akun Kasir sudah ada.`);
        }

        // 2. DATA MANAGER
        res = await client.query('SELECT id FROM "User" WHERE email = $1', ['danendra@gmail.com']);
        if (res.rowCount === 0) {
            const passwordManager = await bcrypt.hash("54321", 10);
            await client.query(
                'INSERT INTO "User" (name, email, password, address, role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
                ["Danendra Manager", "danendra@gmail.com", passwordManager, "Ruang Direksi PDAM", "MANAGER", now]
            );
            console.log(`✅ Akun Manager Siap: danendra@gmail.com`);
        } else {
            console.log(`✅ Akun Manager sudah ada.`);
        }

        // 3. DATA PELANGGAN
        res = await client.query('SELECT id FROM "User" WHERE email = $1', ['pelanggan@gmail.com']);
        if (res.rowCount === 0) {
            const passwordPelanggan = await bcrypt.hash("123", 10);
            await client.query(
                'INSERT INTO "User" (name, email, password, address, role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
                ["Budi Pelanggan", "pelanggan@gmail.com", passwordPelanggan, "Perumahan", "PELANGGAN", now]
            );
            console.log(`✅ Akun Pelanggan Siap: pelanggan@gmail.com`);
        } else {
            console.log(`✅ Akun Pelanggan sudah ada.`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
