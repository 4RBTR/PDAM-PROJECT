"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
import { getUserRole, getUserId } from "@/utils/cookies"
import SidebarUser from "@/components/User/SidebarUser"
import ProfileCard from "@/components/User/ProfileCard"
import UserStatsCards from "@/components/User/UserStatsCards"
import TagihanList from "@/components/User/TagihanList"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import { Menu, Printer } from "lucide-react"
import Image from "next/image"

// Lazy load InvoiceModal (includes html2canvas ~200KB + jspdf ~300KB)
const InvoiceModal = dynamic(() => import("@/components/User/InvoiceModal"), {
    ssr: false,
    loading: () => null,
})

// --- INTERFACES ---
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

export default function UserDashboard() {
    const { user: authUser, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [tagihan, setTagihan] = useState<ITagihan[]>([])
    const [userId, setUserId] = useState<string>("")
    const [greeting, setGreeting] = useState("")
    const [selectedTagihan, setSelectedTagihan] = useState<ITagihan | null>(null)
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    // --- FETCH DATA (parallel with AuthContext using cookies directly) ---
    const ambilData = useCallback(async () => {
        const id = getUserId()
        if (!id) return
        setUserId(String(id))
        setLoading(true)
        try {
            const resT = await api.get(`/tagihan/${id}`)
            if (resT.data.status) setTagihan(resT.data.data)
        } catch {
            console.error("Error fetching data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Selamat Pagi")
        else if (hour < 15) setGreeting("Selamat Siang")
        else if (hour < 18) setGreeting("Selamat Sore")
        else setGreeting("Selamat Malam")

        const role = getUserRole()
        if (role === "MANAGER") { router.push("/manager/dashboard"); return }
        if (role === "KASIR") { toast.error("Halaman khusus Pelanggan."); router.push("/kasir/dashboard"); return }

        // Fetch data immediately using cookie userId (no waiting for AuthContext)
        ambilData()
    }, [router, ambilData])

    // --- UPLOAD HANDLER ---
    const handleUpload = async (id: number, file: File) => {
        const formData = new FormData()
        formData.append("image", file)
        const loadingToast = toast.loading("Mengirim bukti...")

        try {
            const res = await api.post(`/tagihan/upload/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            toast.dismiss(loadingToast)
            if (res.data.status) {
                toast.success("Berhasil! Menunggu verifikasi kasir.")
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

    // --- COMPUTED ---
    const totalTagihan = tagihan.length
    const belumLunas = tagihan.filter(t => t.status_bayar === "BELUM_BAYAR").length
    const menunggu = tagihan.filter(t => t.status_bayar === "MENUNGGU_VERIFIKASI").length

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-700 print:bg-white print:block transition-colors duration-300">

            <SidebarUser
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={logout}
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24 print:m-0 print:p-0 print:block">
                {/* HEADER */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 print:hidden transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
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
                                <Image src={authUser.profile_picture} alt="Profile" width={44} height={44} className="w-full h-full object-cover" />
                            ) : (
                                (authUser?.name || "P").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-5 md:space-y-10">
                    {/* PROFILE CARD */}
                    <ProfileCard
                        greeting={greeting}
                        name={authUser?.name || "Pelanggan"}
                        address={authUser?.address || "Memuat alamat..."}
                        userId={userId}
                    />

                    {/* STATS */}
                    <UserStatsCards
                        totalTagihan={totalTagihan}
                        belumLunas={belumLunas}
                        menunggu={menunggu}
                    />

                    {/* TAGIHAN LIST */}
                    <div className="space-y-6">
                        <TagihanList
                            tagihan={tagihan}
                            loading={loading}
                            onUpload={handleUpload}
                            onViewInvoice={(t) => { setSelectedTagihan(t); setIsInvoiceOpen(true); }}
                        />
                    </div>

                    {/* FOOTER */}
                    <div className="text-center mt-16 pt-8 text-slate-400 dark:text-slate-500 text-sm font-medium print:hidden border-t border-slate-100 dark:border-slate-800">
                        <p>&copy; {new Date().getFullYear()} Hydro-FlowSystems. Butuh bantuan? <button onClick={() => router.push('/user/pengaduan')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Hubungi CS</button></p>
                    </div>
                </div>
            </main>

            {/* INVOICE MODAL */}
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