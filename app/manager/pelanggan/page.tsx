"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    Users, Search, MapPin, Phone,
    ChevronLeft, ChevronRight,
    UserCheck, ArrowRight, Loader2, Menu
} from "lucide-react"
import { getAuthToken, getUserRole, removeAuthToken } from "@/utils/cookies"
import SidebarManager from "@/components/Manager/SidebarManager"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface IPelanggan {
    id: number;
    name: string;
    email: string;
    alamat?: string;
    telepon?: string;
    status?: string;
}

interface IApiPelangganItem {
    id: number;
    name?: string;
    nama?: string;
    email: string;
    address?: string;
    alamat?: string;
    telepon?: string;
    phone?: string;
    status?: string;
}

interface ITransactionData {
    user: IApiPelangganItem;
}

export default function DaftarPelangganManager() {
    const [pelanggan, setPelanggan] = useState<IPelanggan[]>([])
    const [managerName, setManagerName] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const router = useRouter()

    useEffect(() => {
        const token = getAuthToken()
        const role = getUserRole()
        const name = localStorage.getItem("name")

        if (!token || role !== "MANAGER") {
            router.replace("/login")
            return
        }

        if (name) setManagerName(name)
        fetchPelanggan()
    }, [router])

    const fetchPelanggan = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/manager/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            // Jika res.ok false (misal 404 karena route belum terdaftar), lempar ke catch
            if (!res.ok) throw new Error("Endpoint not found");

            const responseData = await res.json();

            if (responseData.status && responseData.data) {
                const mapped = responseData.data.map((item: IApiPelangganItem) => ({
                    id: item.id,
                    // Sesuaikan dengan nama field di Prisma/Database kamu
                    name: item.name || item.nama || "Tanpa Nama",
                    email: item.email || "-",
                    alamat: item.address || item.alamat || "Alamat belum diatur",
                    telepon: item.telepon || item.phone || "-",
                    status: item.status || "Aktif"
                }));
                setPelanggan(mapped);
            } else {
                fetchFallbackFromDashboard();
            }
        } catch (error) {
            console.warn("Menggunakan fallback karena:", error);
            fetchFallbackFromDashboard();
        } finally {
            setLoading(false);
        }
    }

    const fetchFallbackFromDashboard = async () => {
        try {
            const token = getAuthToken()
            const res = await fetch(`${API_URL}/manager/dashboard`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.status && Array.isArray(data.data)) {
                // Mengambil user unik dari data transaksi dashboard
                const usersMap = new Map();
                data.data.forEach((t: ITransactionData) => {
                    if (t.user && !usersMap.has(t.user.id)) {
                        usersMap.set(t.user.id, {
                            id: t.user.id,
                            name: t.user.name || t.user.nama,
                            email: t.user.email,
                            alamat: t.user.address || t.user.alamat || "Alamat belum diatur",
                            telepon: t.user.telepon || "-"
                        });
                    }
                });
                setPelanggan(Array.from(usersMap.values()));
            }
        } catch (err) {
            toast.error("Gagal sinkronisasi data dari dashboard");
        }
    }

    const handleLogout = () => {
        removeAuthToken()
        localStorage.removeItem("name")
        router.push('/')
    }

    const filteredPelanggan = useMemo(() => {
        return pelanggan.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [pelanggan, searchTerm])

    const totalPages = Math.ceil(filteredPelanggan.length / itemsPerPage)
    const currentData = filteredPelanggan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <SidebarManager 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300 overflow-hidden">
                {/* --- STICKY HEADER --- */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Database Pelanggan</h1>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Executive View</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
                            {managerName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-8 md:p-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
                            <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg text-white">
                                <Users size={20} />
                            </div>
                            Database Pelanggan Aktif
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Daftar seluruh pengguna jasa air yang terdaftar di sistem.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Total Pelanggan</p>
                                <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">
                                    {loading ? "..." : `${pelanggan.length} Orang`}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6 transition-colors">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau email pelanggan..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat data pelanggan...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {currentData.length > 0 ? currentData.map((p) => (
                                <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-colors uppercase">
                                            {p.name.charAt(0)}
                                        </div>
                                        <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md uppercase">Aktif</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 truncate">{p.email}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <MapPin size={14} />
                                            <span className="text-[11px] font-medium truncate">{p.alamat}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <Phone size={14} />
                                            <span className="text-[11px] font-medium">{p.telepon}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/manager/pelanggan/${p.id}`)}
                                        className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Lihat Riwayat <ArrowRight size={14} />
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <Users size={40} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Data pelanggan tidak ditemukan.</p>
                                    <button onClick={fetchPelanggan} className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 underline">Refresh data</button>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-colors"
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Hal {currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-colors"
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}