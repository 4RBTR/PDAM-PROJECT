"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import SidebarManager from "@/components/Manager/SidebarManager"
import { getAuthToken, getUserRole, getUserId, removeAuthToken } from "@/utils/cookies"
import api from "@/lib/axios"
import { 
    Search, Clock, CheckCircle, XCircle, 
    RefreshCw, User as UserIcon, Menu
} from "lucide-react"
import Image from "next/image"

// API_URL dimigrasikan ke lib/axios.ts

interface IUserProfile {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    role: string;
}

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

export default function ManagerLayananPage() {
    const [layanan, setLayanan] = useState<ILayanan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [managerName, setManagerName] = useState("Manager")
    const [managerProfile, setManagerProfile] = useState<IUserProfile | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const router = useRouter()

    const ambilData = useCallback(async () => {
        setLoading(true)
        const role = getUserRole()
        
        try {
            const res = await api.get(`/layanan?role=${role}`)
            const data = res.data
            if (data.status) setLayanan(data.data)
        } catch {
            toast.error("Gagal memuat data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const token = getAuthToken()
        const role = getUserRole()
        if (!token || role !== "MANAGER") {
            router.push("/login")
            return
        }

        const fetchProfile = async () => {
            try {
                const res = await api.get(`/user/${getUserId()}`)
                const data = res.data
                if (data.status) {
                    setManagerName(data.data.name)
                    setManagerProfile(data.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchProfile()
        ambilData()
    }, [router, ambilData])

    const filteredData = useMemo(() => {
        return layanan.filter(item => {
            const matchesSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 item.id.toString().includes(searchTerm)
            const matchesFilter = filterStatus === "ALL" || item.status === filterStatus
            return matchesSearch && matchesFilter
        })
    }, [layanan, searchTerm, filterStatus])

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex transition-colors duration-300">

            <SidebarManager 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={() => { removeAuthToken(); router.push("/"); }} 
            />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-72 pb-24 transition-all duration-300">
                {/* --- HEADER --- */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Monitoring Layanan</h1>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-1.5">Overview Permintaan Pelanggan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 ring-4 ring-white overflow-hidden relative">
                            {managerProfile?.profile_picture ? (
                                <Image 
                                    src={managerProfile.profile_picture.startsWith('http') ? managerProfile.profile_picture : `/api/uploads/${managerProfile.profile_picture}`} 
                                    alt="Profile" 
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (managerName || "M").charAt(0).toUpperCase()
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
                                <div className={`w-10 h-10 ${s.c} rounded-2xl flex items-center justify-center`}>
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
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide text-center">
                            <button onClick={() => setFilterStatus("ALL")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "ALL" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"}`}>SEMUA</button>
                            <button onClick={() => setFilterStatus("PENDING")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-white text-slate-500 border border-slate-100"}`}>PENDING</button>
                            <button onClick={() => setFilterStatus("PROSES")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "PROSES" ? "bg-blue-100 text-blue-700" : "bg-white text-slate-500 border border-slate-100"}`}>PROSES</button>
                            <button onClick={() => setFilterStatus("SELESAI")} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filterStatus === "SELESAI" ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500 border border-slate-100"}`}>SELESAI</button>
                        </div>
                    </div>

                    {/* TABLE DATA */}
                    <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
                        {loading ? (
                            <div className="p-20 text-center text-slate-400">Memuat data...</div>
                        ) : filteredData.length === 0 ? (
                            <div className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest text-xs">Data tidak ditemukan</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Pelanggan</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Jenis Layanan</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredData.map((item) => (
                                            <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600">
                                                            <UserIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.user.name}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium">{item.user.phone || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-tight">{item.jenis.replace("_", " ")}</p>
                                                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.deskripsi}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {item.status === "PENDING" && <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Pending</span>}
                                                    {item.status === "PROSES" && <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Proses</span>}
                                                    {item.status === "SELESAI" && <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Selesai</span>}
                                                    {item.status === "DITOLAK" && <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Ditolak</span>}
                                                </td>
                                                <td className="px-8 py-6 text-right font-medium text-slate-400 text-xs">
                                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
