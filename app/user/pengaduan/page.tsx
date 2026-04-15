/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getUserRole, getUserId, getAuthToken } from "@/utils/cookies"
import SidebarUser from "@/components/User/SidebarUser"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import {
    Menu,
    MessageSquarePlus,
    Image as ImageIcon,
    Send,
    Trash2,
    MessageCircle,
    Info,
    CheckCircle2,
    Clock,
    AlertCircle,
    UploadCloud
} from "lucide-react"
import Image from "next/image"

// --- INTERFACES ---
interface IPengaduan {
    id: number;
    judul: string;
    deskripsi: string;
    foto: string | null;
    status: string;
    tanggapan: string | null;
    createdAt: string;
}

export default function UserPengaduan() {
    const { user: authUser, logout } = useAuth()
    // API_URL dimigrasikan ke lib/axios.ts

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [riwayat, setRiwayat] = useState<IPengaduan[]>([])
    const [judul, setJudul] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [foto, setFoto] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    // --- FETCH DATA RIWAYAT ---
    const ambilData = useCallback(async () => {
        const id = getUserId()
        if (!id) return

        try {
            const res = await api.get(`/pengaduan/user/${id}`)
            const data = res.data

            if (data.status) {
                // Reverse agar laporan terbaru ada di atas
                setRiwayat(data.data.reverse())
            }
        } catch {
            toast.error("Gagal terhubung ke server")
        }
    }, [])

    // --- CEK AUTH ---
    useEffect(() => {
        const role = getUserRole()

        if (!getUserId()) {
            router.push("/login")
            return
        }
        if (role === "MANAGER") router.push("/manager/dashboard")
        if (role === "KASIR") router.push("/kasir/dashboard")

        ambilData()
    }, [router, ambilData])

    // --- HANDLE SUBMIT ---
    const handleKirim = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!judul || !deskripsi) return toast.error("Judul dan Deskripsi wajib diisi")

        const id = getUserId()
        const loadingToast = toast.loading("Mengirim laporan...")
        setLoading(true)

        const formData = new FormData()
        formData.append("user_id", id || "")
        formData.append("judul", judul)
        formData.append("deskripsi", deskripsi)
        if (foto) formData.append("image", foto)

        try {
            const res = await api.post("/pengaduan", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            const data = res.data
            toast.dismiss(loadingToast)

            if (data.status) {
                toast.success("Laporan berhasil dikirim!")
                setJudul("")
                setDeskripsi("")
                setFoto(null)
                ambilData()
            } else {
                toast.error(data.message || "Gagal mengirim")
            }
        } catch {
            toast.dismiss(loadingToast)
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setLoading(false)
        }
    }

    // --- HANDLE HAPUS ---
    const executeHapus = async (id: number) => {
        const loadingToast = toast.loading("Sedang menghapus...")

        try {
            const res = await api.delete(`/pengaduan/${id}`)
            const data = res.data

            if (data.status) {
                toast.success("Laporan dibatalkan", { id: loadingToast })
                ambilData()
            } else {
                toast.error(data.message || "Gagal menghapus", { id: loadingToast })
            }
        } catch {
            toast.error("Terjadi kesalahan sistem", { id: loadingToast })
        }
    }

    const handleHapus = (id: number) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-62.5 p-1">
                <div>
                    <p className="font-bold text-slate-800 text-sm">Batalkan Laporan?</p>
                    <p className="text-xs text-slate-500 mt-1">Laporan yang dibatalkan tidak bisa dikembalikan.</p>
                </div>
                <div className="flex gap-2 w-full mt-2">
                    <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-slate-100 text-slate-600 text-xs py-2.5 rounded-lg hover:bg-slate-200 transition font-bold">
                        Kembali
                    </button>
                    <button onClick={() => { toast.dismiss(t.id); executeHapus(id); }} className="flex-1 bg-rose-500 text-white text-xs py-2.5 rounded-lg hover:bg-rose-600 transition font-bold shadow-md shadow-rose-200">
                        Ya, Batalkan
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' })
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-700 transition-colors duration-300">

            {/* SIDEBAR COMPONENT */}
            <SidebarUser
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* Overlay Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24 relative">

                {/* HEADER / NAVBAR */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Layanan Pengaduan</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Pusat Bantuan Hydro-FlowSystems</p>
                        </div>
                    </div>
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
                </header>

                <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">

                    {/* 1. HERO BANNER (Disamakan dengan Tema Dashboard User) */}
                    <div className="bg-[#0A0F2C] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                        {/* Efek Cahaya Abstract (Glowing Orbs) */}
                        <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-br from-blue-600/40 to-indigo-600/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-75 h-75 bg-blue-400/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                        <div className="relative z-10 text-white max-w-2xl">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                    <MessageSquarePlus size={28} className="text-blue-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight">Sampaikan Kendala Anda</h2>
                            </div>
                            <p className="text-blue-100/80 text-sm md:text-base leading-relaxed font-medium">
                                Ada pipa bocor? Air keruh? Atau tagihan tidak sesuai? Jangan ragu untuk melaporkannya. Tim teknis dan layanan pelanggan kami siap merespons laporan Anda secepatnya.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                        {/*KOLOM KIRI: FORMULIR PENGADUAN*/}
                        <div className="lg:col-span-5 h-fit sticky top-32">
                            <div className="bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <MessageSquarePlus size={20} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Buat Tiket Baru</h3>
                                </div>

                                <form onSubmit={handleKirim} className="space-y-5">
                                    {/* Judul */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Subjek Masalah</label>
                                        <input
                                            type="text"
                                            required
                                            value={judul}
                                            onChange={(e) => setJudul(e.target.value)}
                                            placeholder="Contoh: Pipa utama bocor"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:text-slate-100"
                                        />
                                    </div>

                                    {/* Deskripsi */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Detail Lokasi & Kejadian</label>
                                        <textarea
                                            required
                                            value={deskripsi}
                                            onChange={(e) => setDeskripsi(e.target.value)}
                                            placeholder="Jelaskan secara rinci lokasi jalan, blok, atau masalah yang dialami..."
                                            className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:bg-slate-900 transition-all resize-none placeholder:text-slate-400 dark:text-slate-100"
                                        ></textarea>
                                    </div>

                                    {/* Upload Foto (Sesuai gaya User Dashboard) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Lampiran Foto (Opsional)</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group relative overflow-hidden">
                                            {foto ? (
                                                <div className="text-center p-4">
                                                    <CheckCircle2 className="text-blue-500 dark:text-blue-400 mx-auto mb-2" size={28} />
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block truncate max-w-50">{foto.name}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 block">Klik untuk mengganti</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-4">
                                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 shadow-sm text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all">
                                                        <UploadCloud size={20} />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Pilih dari galeri</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">Max 2MB (JPG/PNG)</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                    >
                                        {loading ? "Memproses..." : <><Send size={16} /> Kirim Tiket Laporan</>}
                                    </button>
                                </form>
                            </div>
                        </div>


                        {/* =========================================
                            KOLOM KANAN: RIWAYAT PENGADUAN
                        ========================================= */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Status Laporan Saya</h3>
                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase">
                                    {riwayat.length} Tiket
                                </div>
                            </div>

                            {riwayat.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none">
                                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                                        <Info size={48} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-black text-2xl text-slate-800 dark:text-slate-100 mb-2">Belum Ada Riwayat</h4>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Anda belum pernah membuat laporan atau pengaduan.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {riwayat.map((item) => (
                                        <div key={item.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col gap-6 relative group">

                                            {/* Header Kartu: Status & Tanggal */}
                                            <div className="flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    {item.status === 'SELESAI' ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/40 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                                            <CheckCircle2 size={14} /> SELESAI
                                                        </span>
                                                    ) : item.status === 'PENDING' ? (
                                                        <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-bold bg-rose-50 dark:bg-rose-900/40 px-4 py-2 rounded-xl border border-rose-100 dark:border-rose-800/50">
                                                            <AlertCircle size={14} /> MENUNGGU
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-900/40 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                                            <Clock size={14} /> DIPROSES
                                                        </span>
                                                    )}

                                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>

                                                {/* Tombol Batalkan Laporan (Hanya muncul saat hover di Desktop) */}
                                                <button
                                                    onClick={() => handleHapus(item.id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                                    title="Batalkan Tiket"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Konten Laporan (Text & Image Flex) */}
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1">
                                                    <h4 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 tracking-tight mb-3">{item.judul}</h4>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                                        {item.deskripsi}
                                                    </p>
                                                </div>

                                                {/* Jika ada foto bukti */}
                                                {item.foto && (
                                                    <div className="w-full md:w-40 h-48 md:h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group/img">
                                                        <Image
                                                            src={item.foto.startsWith('http') ? item.foto : `/api/uploads/${item.foto}`}
                                                            alt="Bukti Pengaduan"
                                                            width={160}
                                                            height={128}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                                        />
                                                        <a
                                                            href={item.foto.startsWith('http') ? item.foto : `/api/uploads/${item.foto}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest"
                                                        >
                                                            Lihat Full
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Balasan Admin / Manager */}
                                            {item.tanggapan && (
                                                <div className="mt-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 relative">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                                                            <MessageCircle size={18} strokeWidth={2.5} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Tanggapan Petugas</p>
                                                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                                                                &quot;{item.tanggapan}&quot;
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="text-center mt-16 pt-8 text-slate-400 dark:text-slate-500 text-sm font-medium print:hidden border-t border-slate-100 dark:border-slate-800">
                        <p>&copy; {new Date().getFullYear()} Hydro-FlowSystems.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
