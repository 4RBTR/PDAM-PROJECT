"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import SidebarKasir from "@/components/Kasir/SidebarKasir"
import { getAuthToken, getUserRole } from "@/utils/cookies"
import { 
    Menu, Search, Clock, CheckCircle, XCircle, 
    RefreshCw, Filter, Phone, MapPin, User,
    Trash2
} from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"

// API_BASE_URL dimigrasikan ke lib/axios.ts

interface ILayanan {
    id: number
    userId: number
    jenis: string
    deskripsi: string
    status: string
    createdAt: string
    user: {
        name: string
        phone: string | null
    }
}

export default function KasirLayananPage() {
    const { user: authUser, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [layanan, setLayanan] = useState<ILayanan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")

    const router = useRouter()

    const ambilData = useCallback(async () => {
        setLoading(true)
        const role = getUserRole()
        
        try {
            const res = await api.get(`/layanan?role=${role}`)
            if (res.data.status) setLayanan(res.data.data)
        } catch (error) {
            toast.error("Gagal memuat data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const role = getUserRole()
        if (role !== "KASIR") {
            router.push("/login")
            return
        }
        ambilData()
    }, [router, ambilData])

    const handleUpdateStatus = async (id: number, status: string) => {
        const loadingToast = toast.loading("Mengupdate status...")
        try {
            const res = await api.put(`/layanan/${id}`, { status })
            toast.dismiss(loadingToast)
            if (res.data.status) {
                toast.success(`Berhasil diupdate ke ${status}`)
                ambilData()
            } else {
                toast.error("Gagal update status")
            }
        } catch (error: any) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.message || "Gagal koneksi")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data layanan ini?")) return
        const loadingToast = toast.loading("Menghapus data...")
        try {
            const res = await api.delete(`/layanan/${id}`)
            toast.dismiss(loadingToast)
            if (res.data.status) {
                toast.success("Data berhasil dihapus")
                ambilData()
            } else {
                toast.error("Gagal menghapus data")
            }
        } catch (error: any) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.message || "Gagal koneksi")
        }
    }

    const filteredData = useMemo(() => {
        return layanan.filter(item => {
            const matchesSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 item.id.toString().includes(searchTerm)
            const matchesFilter = filterStatus === "ALL" || item.status === filterStatus
            return matchesSearch && matchesFilter
        })
    }, [layanan, searchTerm, filterStatus])

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden font-sans transition-colors duration-300">

            <SidebarKasir 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={logout} 
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24">
                {/* HEADER */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Manajemen Layanan</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Antrian Pelanggan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-200 ring-4 ring-white overflow-hidden relative">
                            {authUser?.profile_picture ? (
                                <img 
                                    src={authUser.profile_picture} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (authUser?.name || "K").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { l: "Pending", v: layanan.filter(l => l.status === "PENDING").length, c: "bg-amber-500", i: <Clock className="text-white" size={18} /> },
                            { l: "Proses", v: layanan.filter(l => l.status === "PROSES").length, c: "bg-blue-500", i: <RefreshCw className="text-white" size={18} /> },
                            { l: "Selesai", v: layanan.filter(l => l.status === "SELESAI").length, c: "bg-emerald-500", i: <CheckCircle className="text-white" size={18} /> },
                            { l: "Ditolak", v: layanan.filter(l => l.status === "DITOLAK").length, c: "bg-rose-500", i: <XCircle className="text-white" size={18} /> }
                        ].map((s, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                <div className={`w-10 h-10 ${s.c} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5`}>
                                    {s.i}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{s.l}</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{s.v}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Cari nama atau ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button onClick={() => setFilterStatus("ALL")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "ALL" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"}`}>SEMUA</button>
                            <button onClick={() => setFilterStatus("PENDING")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-white text-slate-500 border border-slate-100"}`}>PENDING</button>
                            <button onClick={() => setFilterStatus("PROSES")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "PROSES" ? "bg-blue-100 text-blue-700" : "bg-white text-slate-500 border border-slate-100"}`}>PROSES</button>
                            <button onClick={() => setFilterStatus("SELESAI")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "SELESAI" ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500 border border-slate-100"}`}>SELESAI</button>
                        </div>
                    </div>

                    {/* GRID DATA */}
                    {loading ? (
                        <div className="p-20 text-center text-slate-400">Memuat antrian...</div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-4xl border border-slate-100">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Kosong.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredData.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col lg:flex-row gap-8 items-center shadow-lg shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                                <User size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">{item.user.name}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"><Phone size={12} /> {item.user.phone || "No HP Kosong"}</span>
                                                    <span className="text-[11px] font-bold text-slate-400">Ticket ID: #{item.id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Permintaan Layanan</p>
                                            <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2 uppercase tracking-tight">{item.jenis.replace("_", " ")}</h5>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.deskripsi}</p>
                                        </div>
                                    </div>

                                    <div className="lg:w-72 w-full flex flex-col gap-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Aksi Cepat</p>
                                        
                                        {(item.status === "PENDING" || item.status === "PROSES") ? (
                                            <>
                                                <button 
                                                    onClick={() => handleUpdateStatus(item.id, "PROSES")}
                                                    disabled={item.status === "PROSES"}
                                                    className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${item.status === "PROSES" ? "bg-blue-100 text-blue-700 opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"}`}
                                                >
                                                    {item.status === "PROSES" ? "Sedang Diproses" : "Proses Sekarang"}
                                                </button>
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item.id, "SELESAI")}
                                                        className="flex-1 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Selesai
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item.id, "DITOLAK")}
                                                        className="flex-1 py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Permintaan Selesai</p>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-full py-3 bg-white dark:bg-slate-900 text-rose-600 border border-rose-100 dark:border-rose-900/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Hapus Data
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
