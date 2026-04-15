"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Mail, Printer, Calendar, Activity, Menu } from "lucide-react"

import { getUserRole } from "@/utils/cookies"
import SidebarManager from "@/components/Manager/SidebarManager"
import StatsCards from "@/components/Manager/StatsCards"
import StatusSummary from "@/components/Manager/StatusSummary"
import TransactionTable from "@/components/Manager/TransactionTable"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"

// Lazy load Recharts component (~250KB)
const RevenueChart = dynamic(() => import("@/components/Manager/RevenueChart"), {
    ssr: false,
    loading: () => (
        <div className="h-80 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
            <Activity className="text-slate-300" size={32} />
        </div>
    ),
})

// --- INTERFACES ---
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

// --- SKELETON ---
const DashboardSkeleton = () => (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
        <div className="w-72 hidden lg:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 space-y-8">
            <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
            </div>
        </div>
        <div className="flex-1 p-8 space-y-8">
            <div className="h-20 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse"></div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse"></div>
                <div className="h-96 bg-slate-900 dark:bg-slate-800 rounded-3xl shadow-sm animate-pulse"></div>
            </div>
        </div>
    </div>
)

export default function ManagerDashboard() {
    const { user: authUser, logout } = useAuth()
    const [stats, setStats] = useState<IStats | null>(null)
    const [transaksi, setTransaksi] = useState<ITagihan[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Table state
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const router = useRouter()

    // --- DATA FETCHING ---
    useEffect(() => {
        const role = getUserRole()
        if (role !== "MANAGER") {
            toast.error("Akses Ditolak. Area Terbatas.")
            router.replace("/login")
            return
        }

        const fetchData = async () => {
            try {
                const res = await api.get("/manager/dashboard")
                if (res.data.status) {
                    setStats(res.data.stats)
                    setTransaksi(res.data.data)
                } else {
                    toast.error(res.data.message || "Gagal memuat data")
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                console.error("Error:", err)
                toast.error(err.response?.data?.message || "Gagal terhubung ke server.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [router])

    // --- COMPUTED ---
    const handleLogout = () => {
        if (!confirm("Keluar dari Executive Dashboard?")) return;
        logout()
    }

    const filteredTransaksi = useMemo(() => {
        return transaksi.filter(item => {
            const matchesSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toString().includes(searchTerm);
            const matchesStatus = filterStatus === "ALL" || item.status_bayar === filterStatus;
            return matchesSearch && matchesStatus;
        })
    }, [transaksi, searchTerm, filterStatus])

    useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredTransaksi.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.max(1, Math.ceil(filteredTransaksi.length / itemsPerPage))

    // Chart data
    const realChartData = useMemo(() => {
        if (!transaksi || transaksi.length === 0) return [];
        const monthMap: Record<string, number> = {
            "Januari": 1, "Februari": 2, "Maret": 3, "April": 4, "Mei": 5, "Juni": 6,
            "Juli": 7, "Agustus": 8, "September": 9, "Oktober": 10, "November": 11, "Desember": 12
        };
        const grouped: Record<string, { year: number, monthNum: number, aktual: number }> = {};
        transaksi.forEach(t => {
            if (t.status_bayar === 'LUNAS') {
                const labelBulan = t.bulan ? t.bulan.substring(0, 3) : "Unk";
                const key = `${labelBulan} ${t.tahun}`;
                if (!grouped[key]) {
                    grouped[key] = { year: t.tahun, monthNum: monthMap[t.bulan] || 0, aktual: 0 };
                }
                grouped[key].aktual += t.total_bayar;
            }
        });
        return Object.entries(grouped)
            .map(([name, data]) => ({ name, year: data.year, monthNum: data.monthNum, aktual: data.aktual }))
            .sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthNum - b.monthNum);
    }, [transaksi]);

    const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0)

    // --- RENDER ---
    if (loading) return <DashboardSkeleton />

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-indigo-100 selection:text-indigo-700 transition-colors duration-300">

            <SidebarManager
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300 overflow-hidden">
                {/* HEADER */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Executive Overview</h1>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Hydro-Flow Manager</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 ring-4 ring-white overflow-hidden relative">
                            {authUser?.profile_picture ? (
                                <Image src={authUser.profile_picture} alt="Profile" width={44} height={44} className="w-full h-full object-cover" />
                            ) : (
                                (authUser?.name || "M").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 space-y-8">
                    {/* TITLE BAR */}
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-6 pb-2">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full text-xs font-bold mb-3 w-max border border-indigo-100 dark:border-indigo-800/50">
                                <Activity size={14} className="animate-pulse" />
                                <span>Live Dashboard</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Overview Kinerja</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto">
                            <Link href="/manager/pengaduan" className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md transition-all flex items-center justify-center gap-2 flex-1 lg:flex-none">
                                <Mail size={18} />
                                <span>Pesan Masuk</span>
                                {stats && stats.unread_pengaduan > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                        {stats.unread_pengaduan}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => window.print()} className="bg-linear-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 flex-1 lg:flex-none">
                                <Printer size={18} />
                                <span className="hidden sm:inline">Export Laporan</span>
                            </button>
                        </div>
                    </div>

                    {/* STATS CARDS */}
                    <StatsCards stats={stats} formatRp={formatRp} />

                    {/* CHART + STATUS */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:break-inside-avoid">
                        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">Revenue Analytics</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Pendapatan Riil Berdasarkan Riwayat Transaksi Lunas</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        <span className="text-slate-600 dark:text-slate-300">Pendapatan Aktual</span>
                                    </div>
                                </div>
                            </div>
                            <RevenueChart data={realChartData} formatRp={formatRp} />
                        </div>

                        <StatusSummary stats={stats} />
                    </div>

                    {/* TRANSACTION TABLE */}
                    <TransactionTable
                        items={currentItems}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        formatRp={formatRp}
                    />
                    
                    <div className="text-center mt-12 mb-8 text-slate-400 dark:text-slate-500 text-sm font-medium">
                        <p>&copy; {new Date().getFullYear()} Hydro-FlowSystems Executive.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}