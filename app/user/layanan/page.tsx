"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import SidebarUser from "@/components/User/SidebarUser"
import { getAuthToken, getUserRole } from "@/utils/cookies"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import { 
    Menu, Plus, Clock, CheckCircle, XCircle, 
    Droplets, PenTool, ClipboardList, Send 
} from "lucide-react"
import Image from "next/image"

// API_BASE_URL dimigrasikan ke lib/axios.ts

interface ILayanan {
    id: number
    jenis: string
    deskripsi: string
    status: string
    createdAt: string
}

export default function UserLayananPage() {
    const { user: authUser, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [layanan, setLayanan] = useState<ILayanan[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ jenis: "PASANG_BARU", deskripsi: "" })
    const [customJenis, setCustomJenis] = useState("")

    const router = useRouter()

    const ambilData = useCallback(async () => {
        if (!authUser?.id) return
        const role = getUserRole()
        
        try {
            const res = await api.get(`/layanan?userId=${authUser.id}&role=${role}`)
            if (res.data.status) setLayanan(res.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [authUser])

    useEffect(() => {
        const token = getAuthToken()
        if (!token) {
            router.push("/login")
            return
        }
        if (authUser?.id) {
            ambilData()
        }
    }, [router, ambilData, authUser])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.deskripsi) return toast.error("Masukkan deskripsi permintaan")

        const loadingToast = toast.loading("Mengirim permintaan...")
        try {
            const res = await api.post("/layanan", { 
                userId: authUser?.id,
                jenis: form.jenis === "LAINNYA" ? customJenis : form.jenis,
                deskripsi: form.deskripsi
            })
            toast.dismiss(loadingToast)
            if (res.data.status) {
                toast.success("Permintaan layanan berhasil dikirim!")
                setShowForm(false)
                setForm({ jenis: "PASANG_BARU", deskripsi: "" })
                setCustomJenis("")
                ambilData()
            } else {
                toast.error("Gagal mengirim permintaan")
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.dismiss(loadingToast)
            toast.error(err.response?.data?.message || "Terjadi kesalahan koneksi")
        }
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">

            <SidebarUser 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24">
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Layanan Terpadu</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Hydro-FlowSystems</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowForm(true)}
                            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Buat Permintaan
                        </button>
                        <div className="w-11 h-11 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-200 ring-4 ring-white overflow-hidden relative">
                            {authUser?.profile_picture ? (
                                <Image 
                                    src={authUser.profile_picture} 
                                    alt="Profile" 
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (authUser?.name || "P").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-10">
                    {/* INFO HERO */}
                    <div className="bg-linear-to-r from-blue-700 to-indigo-700 rounded-4xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="space-y-3 text-center md:text-left">
                                <h2 className="text-3xl font-black">Butuh Bantuan Teknis?</h2>
                                <p className="text-blue-100/80 max-w-md">Kini Anda bisa mengajukan pemasangan baru, perbaikan meter, atau layanan teknis lainnya secara langsung dari aplikasi.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center shrink-0">
                                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Status Terkini</p>
                                <p className="text-4xl font-black">{layanan.length}</p>
                                <p className="text-blue-100/60 text-xs">Total Permintaan</p>
                            </div>
                        </div>
                    </div>

                    {/* LIST LAYANAN */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <ClipboardList size={20} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Riwayat Layanan</h3>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center text-slate-400">Memuat riwayat...</div>
                        ) : layanan.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-4xl p-16 text-center">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <ClipboardList size={40} />
                                </div>
                                <h4 className="font-bold text-lg">Belum Ada Permintaan</h4>
                                <p className="text-slate-500 text-sm">Klik tombol &quot;Buat Permintaan&quot; untuk mengajukan layanan baru.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {layanan.map((item, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                                                ID: #{item.id.toString().padStart(4, '0')}
                                            </div>
                                            {item.status === "PENDING" && <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-100"><Clock size={14} /> Menunggu</span>}
                                            {item.status === "PROSES" && <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold border border-blue-100"><PenTool size={14} /> Diproses</span>}
                                            {item.status === "SELESAI" && <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100"><CheckCircle size={14} /> Selesai</span>}
                                            {item.status === "DITOLAK" && <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold border border-rose-100"><XCircle size={14} /> Ditolak</span>}
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 truncate group-hover:text-blue-600 transition-colors uppercase">
                                            {item.jenis.replace("_", " ")}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 md:h-10 mb-4">{item.deskripsi}</p>
                                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Diajukan pada</span>
                                            <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL FORM */}
            {showForm && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Buat Permintaan Layanan</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Lengkapi detail permintaan bantuan teknis Anda.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors">
                                <Menu size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Jenis Layanan</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "PASANG_BARU", label: "Pasang Baru", icon: <Plus size={16} /> },
                                        { id: "PERBAIKAN", label: "Perbaikan", icon: <PenTool size={16} /> },
                                        { id: "CEK_METER", label: "Cek Meter", icon: <Droplets size={16} /> },
                                        { id: "LAINNYA", label: "Lainnya", icon: <ClipboardList size={16} /> }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setForm({ ...form, jenis: type.id })}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm ${
                                                form.jenis === type.id 
                                                ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-500"
                                            }`}
                                        >
                                            {type.icon} {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {form.jenis === "LAINNYA" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Sebutkan Jenis Layanan Anda</label>
                                    <input 
                                        required 
                                        type="text"
                                        value={customJenis}
                                        onChange={(e) => setCustomJenis(e.target.value)}
                                        placeholder="Misal: Ganti Kran, Pembersihan Pipa, dll..."
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Detail Masalah / Permintaan</label>
                                <textarea 
                                    required 
                                    rows={4}
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    placeholder="Ceritakan kendala atau alasan pengajuan pemasangan baru..."
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Batal</button>
                                <button type="submit" className="flex-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2">
                                    Kirim Permintaan <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
