"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getUserRole } from "@/utils/cookies"
import SidebarUser from "@/components/User/SidebarUser"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import {
    Menu,
    Printer,
    MapPin,
    FileText,
    AlertCircle,
    Clock,
    Headphones,
    CheckCircle2,
    CreditCard,
    ArrowRight,
    Eye
} from "lucide-react"
import Image from "next/image"
import InvoiceModal from "@/components/User/InvoiceModal"

// --- KONFIGURASI API ---
// Dimigrasikan ke lib/axios.ts

interface ITagihan {
    id: number;
    bulan: string;
    tahun: number;
    meter_awal: number;
    meter_akhir: number;
    total_bayar: number;
    status_bayar: string;
    bukti_bayar: string | null;
}

// --- SKELETON COMPONENT ---
const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-pulse mb-6">
        <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-10 flex-1 flex flex-col justify-center">
                <div className="flex gap-4 mb-8">
                    <div className="bg-slate-100 dark:bg-slate-800 h-8 w-32 rounded-xl"></div>
                    <div className="bg-slate-100 dark:bg-slate-800 h-8 w-24 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 h-4 w-20 rounded"></div>
                    <div className="bg-slate-100 dark:bg-slate-800 h-12 w-64 rounded-2xl"></div>
                </div>
            </div>
            <div className="p-8 lg:w-96 bg-slate-50/50 dark:bg-slate-800/20 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
            </div>
        </div>
    </div>
)

// User type is provided by AuthContext

export default function UserDashboard() {
    const { user: authUser, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [tagihan, setTagihan] = useState<ITagihan[]>([])
    // profile and name are now managed by AuthContext
    const [userId, setUserId] = useState<string>("")
    const [greeting, setGreeting] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadingId, setUploadingId] = useState<number | null>(null)
    const [selectedTagihan, setSelectedTagihan] = useState<ITagihan | null>(null)
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    // --- LOGIC FETCH DATA ---
    const ambilData = useCallback(async () => {
        if (!authUser?.id) return
        setLoading(true)
        try {
            const resT = await api.get(`/tagihan/${authUser.id}`)
            if (resT.data.status) setTagihan(resT.data.data)
        } catch {
            console.error("Error fetching data")
        } finally {
            setLoading(false)
        }
    }, [authUser])

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Selamat Pagi")
        else if (hour < 15) setGreeting("Selamat Siang")
        else if (hour < 18) setGreeting("Selamat Sore")
        else setGreeting("Selamat Malam")

        const role = getUserRole()

        if (role === "MANAGER") {
            router.push("/manager/dashboard")
            return
        }
        if (role === "KASIR") {
            toast.error("Halaman khusus Pelanggan.")
            router.push("/kasir/dashboard")
            return
        }

        if (authUser?.id) {
            setUserId(authUser.id)
            ambilData()
        }
    }, [router, ambilData, authUser])

    // --- LOGIC UPLOAD ---
    const handleUpload = async (id: number) => {
        if (!selectedFile) return toast.error("Pilih foto bukti transfer dulu!")
        const formData = new FormData()
        formData.append("image", selectedFile)
        const loadingToast = toast.loading("Mengirim bukti...")

        try {
            const res = await api.post(`/tagihan/upload/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            toast.dismiss(loadingToast)
            if (res.data.status) {
                toast.success("Berhasil! Menunggu verifikasi kasir.")
                setUploadingId(null)
                setSelectedFile(null)
                ambilData()
            } else {
                toast.error("Gagal: " + res.data.message)
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.dismiss(loadingToast)
            toast.error(err.response?.data?.message || "Kesalahan koneksi.")
        }
    }

    const handleLogout = () => {
        logout()
    }

    const totalTagihan = tagihan.length
    const belumLunas = tagihan.filter(t => t.status_bayar === "BELUM_BAYAR").length
    const menunggu = tagihan.filter(t => t.status_bayar === "MENUNGGU_VERIFIKASI").length

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-700 print:bg-white print:block transition-colors duration-300">

            {/* SIDEBAR COMPONENT */}
            <SidebarUser
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24 print:m-0 print:p-0 print:block">

                {/* HEADER / NAVBAR */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 print:hidden transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Dashboard</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Portal Pelanggan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => window.print()} className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 transition-all shadow-sm">
                            <Printer size={16} /> Cetak
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

                <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-5 md:space-y-10">

                    {/* 1. HERO BANNER - MOBILE (LIGHT) & DESKTOP (PREMIUM) */}
                    {/* MOBILE HERO: Ultra-clean, high performance */}
                    <div className="lg:hidden bg-[#0A0F2C] rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-row items-center justify-between gap-4">
                        <div className="relative z-10 flex-1 min-w-0">
                            <p className="text-blue-400/80 text-[8px] font-black uppercase tracking-[0.2em] mb-1">{greeting}</p>
                            <h2 className="text-xl font-black text-white truncate leading-tight uppercase font-heading">{authUser?.name?.split(' ')[0] || "User"}</h2>
                            <div className="flex items-center gap-2 text-blue-200/40 text-[9px] font-bold mt-1">
                                <MapPin size={10} className="shrink-0" />
                                <span className="truncate">{authUser?.address || "Alamat..."}</span>
                            </div>
                        </div>
                        <div className="relative z-10 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-center">
                            <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-0.5">ID PELANGGAN</p>
                            <p className="text-lg font-mono font-black text-white tracking-widest leading-none">
                                <span className="text-blue-500 text-sm mr-0.5">#</span>{String(userId || '').padStart(5, '0')}
                            </p>
                        </div>
                    </div>

                    {/* DESKTOP HERO: Full premium experience */}
                    <div className="hidden lg:flex bg-[#0A0F2C] rounded-[2.5rem] p-12 shadow-2xl shadow-blue-900/10 relative overflow-hidden flex-row justify-between items-center gap-8 print:shadow-none print:border print:bg-none print:text-black">
                        {/* Reduced blur radius for faster rendering */}
                        <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-br from-blue-600/30 to-indigo-600/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                        <div className="relative z-10 text-white w-full md:w-auto">
                            <p className="text-blue-200/60 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                                {greeting} 👋
                            </p>
                            <h2 className="text-6xl font-black capitalize mb-8 tracking-tighter leading-none">{authUser?.name || "Pelanggan"}</h2>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="inline-flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xl px-5 py-3.5 rounded-2xl border border-white/10 shadow-inner group/addr">
                                    <MapPin size={14} className="text-blue-400 shrink-0" />
                                    <span className="font-bold text-blue-50 max-w-[200px] truncate">{authUser?.address || "Memuat alamat..."}</span>
                                </div>
                                <div className="inline-flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xl px-5 py-3.5 rounded-2xl border border-white/10 shadow-inner group/role">
                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                    <span className="font-bold text-emerald-50">Pelanggan Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* ID Pelanggan Wrapper */}
                        <div className="relative z-10 w-[280px] bg-white/5 backdrop-blur-2xl p-8 rounded-4xl border border-white/10">
                            <div className="flex flex-col items-end justify-center">
                                <p className="text-[11px] font-black text-blue-300/80 uppercase tracking-[0.2em] mb-3">ID Pelanggan</p>
                                <div className="flex items-center gap-3 text-white">
                                    <span className="text-blue-400 font-black text-2xl">#</span>
                                    <p className="text-5xl font-mono font-black tracking-[0.15em] leading-none">{String(userId || '').padStart(5, '0')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. STATS SUMMARY - MENGGUNAKAN GRID YANG LEBIH PROPORIONAL */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 print:hidden">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <FileText size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Semua Tagihan</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{totalTagihan}</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                                    <AlertCircle size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Belum Lunas</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{belumLunas}</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                                    <Clock size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Verifikasi</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{menunggu}</p>
                            </div>
                        </div>

                        {/* Action Card: Pengaduan */}
                        <div
                            onClick={() => router.push('/user/pengaduan')}
                            className="cursor-pointer bg-slate-900 p-6 rounded-4xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col justify-between h-36 text-white hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Dekorasi Card Action */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-700/50 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                    <Headphones size={24} strokeWidth={2.5} />
                                </div>
                                <ArrowRight className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Bantuan</p>
                                <p className="text-xl font-black leading-tight">Buat Laporan</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. LIST TAGIHAN */}
                    <div className="space-y-6">
                        {/* HISTORY PEMBAYARAN - Optimized Mobile & Desktop */}
                        {loading ? (
                            <div className="space-y-4">
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : tagihan.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                                <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">Belum Ada Tagihan</h4>
                            </div>
                        ) : (
                            <div className="space-y-4 md:space-y-8">
                                {tagihan.map((t) => (
                                    <div key={t.id} className="group overflow-hidden rounded-3xl md:rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl dark:hover:border-blue-500/30">
                                        <div className="flex flex-col lg:flex-row">
                                            {/* LEFT SIDE: Info */}
                                            <div className="flex-1 p-5 md:p-10 flex flex-col justify-center">
                                                <div className="flex items-center gap-3 mb-6 md:mb-8">
                                                    <div className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase tracking-widest">{t.bulan} {t.tahun}</div>
                                                    <div className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5
                                                        ${t.status_bayar === "LUNAS" ? "bg-emerald-50 text-emerald-600" : t.status_bayar === "BELUM_BAYAR" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}
                                                    `}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${t.status_bayar === "LUNAS" ? "bg-emerald-600" : t.status_bayar === "BELUM_BAYAR" ? "bg-rose-600" : "bg-amber-600"}`}></div>
                                                        {t.status_bayar}
                                                    </div>
                                                </div>

                                                <div className="flex flex-row items-end justify-between md:justify-start md:gap-16">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Total Tagihan</p>
                                                        <h4 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Rp {t.total_bayar.toLocaleString('id-ID')}</h4>
                                                    </div>
                                                    <div className="hidden sm:block opacity-60">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meter</p>
                                                        <p className="text-xs font-bold">{t.meter_akhir - t.meter_awal} m³</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: Action */}
                                            <div className="p-5 md:p-10 md:w-80 bg-slate-50/50 dark:bg-slate-800/20 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex items-center print:hidden">
                                                {t.status_bayar === "LUNAS" ? (
                                                    <button onClick={() => { setSelectedTagihan(t); setIsInvoiceOpen(true); }} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all">
                                                        <Eye size={16} /> Lihat Invoce
                                                    </button>
                                                ) : t.status_bayar === "MENUNGGU_VERIFIKASI" ? (
                                                    <div className="w-full text-center text-[11px] font-black text-amber-600/70 uppercase tracking-widest italic">
                                                        Sedang Diverifikasi
                                                    </div>
                                                ) : (
                                                    <div className="w-full space-y-3">
                                                        {uploadingId === t.id ? (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setUploadingId(null)} className="flex-1 py-3 text-xs font-bold text-slate-400">Batal</button>
                                                                <button onClick={() => handleUpload(t.id)} className="flex-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase">Kirim Bukti</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setUploadingId(t.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                                                                <CreditCard size={18} /> Bayar Tagihan
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="text-center mt-16 pt-8 text-slate-400 dark:text-slate-500 text-sm font-medium print:hidden border-t border-slate-100 dark:border-slate-800">
                        <p>&copy; {new Date().getFullYear()} Hydro-FlowSystems. Butuh bantuan? <button onClick={() => router.push('/user/pengaduan')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Hubungi CS</button></p>
                    </div>
                </div>
            </main>

            {/* MODAL INVOICE */}
            {selectedTagihan && (
                <InvoiceModal 
                    isOpen={isInvoiceOpen}
                    onClose={() => setIsInvoiceOpen(false)}
                    data={selectedTagihan}
                    user={{
                        name: authUser?.name || "Pelanggan",
                        address: authUser?.address || "Alamat tidak tersedia",
                        id: userId
                    }}
                />
            )}
        </div>
    )
}