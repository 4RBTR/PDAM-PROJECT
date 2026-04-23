# 🌊 HydroFlow Systems - PDAM Management Solution

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hydro-flowsystems.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

**HydroFlow Systems** adalah platform manajemen modern untuk Perusahaan Daerah Air Minum (PDAM) yang dirancang untuk mempercepat proses administrasi, penagihan, dan pelaporan transaksi secara efisien dan transparan.

---

## 🚀 Live Demo
Akses aplikasi yang sudah dideploy di sini:  
👉 **[https://hydro-flowsystems.vercel.app](https://hydro-flowsystems.vercel.app)**

---

## ✨ Fitur Utama
Aplikasi ini mendukung 3 peran pengguna utama dengan fitur yang disesuaikan:

### 👤 User (Pelanggan)
- Melihat tagihan air bulanan secara real-time.
- Riwayat transaksi pembayaran.
- Manajemen profil pelanggan.

### 💰 Kasir (Cashier)
- Proses input pembayaran pelanggan.
- Validasi bukti pembayaran.
- Cetak struk/invoice dalam format PDF.
- Monitoring transaksi harian.

### 📊 Manager
- Dashboard analitik performa perusahaan.
- Laporan pendapatan periodik.
- Visualisasi data menggunakan grafik interaktif.
- Manajemen data pelanggan dan petugas.

---

## 🛠️ Teknologi yang Digunakan
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Authentication**: JWT & Bcryptjs
- **Charts**: Recharts
- **PDF Generation**: JSPDF & Html2canvas

---

## ⚙️ Cara Instalasi & Penggunaan Lokal

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

### 1. Clone Repository
```bash
git clone https://github.com/username/frontend-pdam.git
cd frontend-pdam
```
*(Ganti URL clone dengan repository yang sesuai)*

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di direktori root dan masukkan konfigurasi berikut:
```env
# Database Connections
DATABASE_URL="your_postgresql_transaction_url"
DIRECT_URL="your_postgresql_direct_url"

# Authentication
JWT_SECRET="your_jwt_secret_key"

# Supabase Storage (Optional for uploads)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# API Configuration
NEXT_PUBLIC_API_URL="/api"
```

### 4. Sinkronisasi Database (Prisma)
Jalankan perintah ini untuk melakukan generate client Prisma:
```bash
npx prisma generate
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Struktur Folder
- `/app`: Rute halaman dan logika API (Next.js App Router).
- `/components`: Komponen UI yang dapat digunakan kembali.
- `/context`: State management menggunakan React Context.
- `/lib`: Konfigurasi library (Prisma Client, Supabase, dll).
- `/prisma`: Schema database dan file migrasi.
- `/public`: Aset statis seperti gambar dan ikon.
- `/utils`: Fungsi pembantu (helper functions).

---

## 📝 Lisensi
Project ini dibuat untuk keperluan tugas produktif dan pengembangan sistem informasi.

---
*Dibuat dengan ❤️ oleh Tim Pengembang HydroFlow.*
