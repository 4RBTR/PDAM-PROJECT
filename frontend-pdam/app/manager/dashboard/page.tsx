"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
// 👇 1. Import Helper Cookies
import { getAuthToken, getUserRole, removeAuthToken } from "@/utils/cookies"
// Definisi Tipe Data
interface IStats {
    total_pendapatan: number;
    total_pelanggan: number;
    transaksi_lunas: number;
    transaksi_tunggakan: number;
    total_air: number;
    unread_pengaduan: number;
}

interface ITagihan {
    id: number;
    user: { name: string; email: string };
    bulan: string;
    tahun: number;
    total_bayar: number;
    status_bayar: string;
    meter_awal: number;
    meter_akhir: number;
}

export default function ManagerDashboard() {
    const [stats, setStats] = useState<IStats | null>(null)
    const [transaksi, setTransaksi] = useState<ITagihan[]>([])
    const [managerName, setManagerName] = useState("")
    const router = useRouter()

    useEffect(() => {
        // --- 2. UBAH PROTEKSI PAKE COOKIES ---
        const token = getAuthToken() // ✅ Ambil dari Cookies
        const role = getUserRole()   // ✅ Ambil dari Cookies

        // Catatan: Nama biasanya tidak disimpan di cookie (terlalu panjang). 
        // Kita tetap ambil dari localStorage (karena login menyimpannya disana) 
        // atau nanti diambil dari API profil.
        const name = localStorage.getItem("name")

        // Cek Login
        if (!token) {
            router.push("/login")
            return
        }

        // Cek Role
        if (role !== "MANAGER") {
            if (role === "PELANGGAN") {
                router.push("/pelanggan/dashboard")
                return
            }
            if (role === "KASIR") {
                toast.error("Akses Ditolak. Halaman ini khusus Manager.")
                router.push("/login")
                return
            }
            router.push("/login")
            return
        }

        // Set Nama (untuk tampilan UI)
        if (name) setManagerName(name)

        // eslint-disable-next-line react-hooks/immutability
        fetchData()
    }, [router])

    const fetchData = async () => {
        try {
            // Ambil token terbaru untuk request API
            const token = getAuthToken()

            const res = await fetch("http://localhost:8000/manager/dashboard", {
                // ✅ Tambahkan Header Authorization biar request valid
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await res.json()
            if (data.status) {
                setStats(data.stats)
                setTransaksi(data.data)
            }
        } catch (error) {
            console.error("Gagal ambil data manager", error)
            toast.error("Gagal memuat data dashboard.")
        }
    }

    // --- 3. UBAH FUNGSI LOGOUT ---
    const handleLogout = () => {
        removeAuthToken() // ✅ Hapus Cookies
        localStorage.removeItem("name") // Hapus sisa data nama di localstorage
        toast.success("Berhasil Logout")
        router.push('/login')
    }

    // Format Uang (Rp)
    const formatRp = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
            {/* NAVBAR */}
            <nav className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Executive Dashboard</h1>
                        <p className="text-xs text-slate-400">PDAM Digital Monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* TOMBOL KOTAK MASUK */}
                    <button
                        onClick={() => router.push('/manager/pengaduan')}
                        className="hidden md:flex relative bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition items-center gap-2 group"
                    >
                        <span>📬 Kotak Masuk</span>

                        {/* Logic Notifikasi Badge */}
                        {stats && stats.unread_pengaduan > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900 animate-pulse shadow-lg">
                                {stats.unread_pengaduan}
                            </span>
                        )}
                    </button>
                    <div className="text-right hidden md:block border-l border-slate-700 pl-4">
                        <p className="text-sm font-bold">{managerName}</p>
                        <p className="text-xs text-indigo-400">Manager Area</p>
                    </div>

                    {/* TOMBOL LOGOUT BARU */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

                {/* 1. STATISTIK CARDS (4 KOTAK UTAMA) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card Pendapatan */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-8xl">💰</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Pendapatan</p>
                        <h3 className="text-3xl font-black text-emerald-600">
                            {stats ? formatRp(stats.total_pendapatan) : "..."}
                        </h3>
                        <p className="text-xs text-slate-400">Akumulasi pembayaran lunas</p>
                    </div>

                    {/* Card Debit Air */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-8xl">💧</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Air Terjual</p>
                        <h3 className="text-3xl font-black text-sky-600">
                            {stats ? stats.total_air.toLocaleString('id-ID') : "..."} <span className="text-lg text-slate-400">m³</span>
                        </h3>
                        <p className="text-xs text-slate-400">Volume pemakaian pelanggan</p>
                    </div>

                    {/* Card Pelanggan */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-8xl">👥</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Pelanggan</p>
                        <h3 className="text-3xl font-black text-indigo-600">
                            {stats ? stats.total_pelanggan : "..."} <span className="text-lg text-slate-400">Orang</span>
                        </h3>
                        <p className="text-xs text-slate-400">Pelanggan aktif terdaftar</p>
                    </div>

                    {/* Card Status Lunas */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <span className="text-8xl">📊</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Rasio Pembayaran</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-black text-slate-800">
                                {stats ? stats.transaksi_lunas : "..."}
                            </h3>
                            <span className="text-sm font-bold text-green-500 mb-1">Lunas</span>
                            <span className="text-sm text-slate-300 mb-1">/</span>
                            <span className="text-sm font-bold text-red-500 mb-1">{stats ? stats.transaksi_tunggakan : "..."} Belum</span>
                        </div>
                        {/* Progress Bar Mini */}
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div
                                className="bg-green-500 h-full transition-all duration-1000"
                                style={{ width: stats ? `${(stats.transaksi_lunas / ((stats.transaksi_lunas + stats.transaksi_tunggakan) || 1)) * 100}%` : '0%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 2. TABEL TRANSAKSI TERBARU */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-slate-800">📋 Transaksi Terkini</h3>
                        <button onClick={() => window.print()} className="text-sm text-indigo-600 font-bold hover:underline print:hidden">
                            Download Laporan PDF
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">ID Transaksi</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4">Pemakaian Air</th>
                                    <th className="px-6 py-4">Total Bayar</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transaksi.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">Belum ada data transaksi masuk.</td>
                                    </tr>
                                ) : (
                                    transaksi.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-mono font-bold text-slate-400">#{t.id}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{t.user.name}</p>
                                                <p className="text-xs text-slate-400">{t.user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{t.bulan} {t.tahun}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {t.meter_akhir - t.meter_awal} m³
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {formatRp(t.total_bayar)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {t.status_bayar === 'LUNAS' ? (
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">LUNAS</span>
                                                ) : t.status_bayar === 'MENUNGGU_VERIFIKASI' ? (
                                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">VERIFIKASI</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">BELUM BAYAR</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}