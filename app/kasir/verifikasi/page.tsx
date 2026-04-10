"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import toast from "react-hot-toast"
import { getAuthToken, getUserRole, getUserId } from "@/utils/cookies"
import SidebarKasir from "@/components/Kasir/SidebarKasir"
import api from "@/lib/axios"
import { 
    Menu, 
    CheckCircle, 
    XCircle, 
    ExternalLink, 
    Search, 
    Clock, 
    AlertCircle,
    ChevronRight,
    Trash2
} from "lucide-react"

interface ITagihanVerifikasi {
    id: number;
    userName: string;
    bulan: string;
    tahun: number;
    total_bayar: number;
    bukti_bayar: string;
    status: string;
}

export default function VerifikasiPage() {
    // API_URL dimigrasikan ke lib/axios.ts
    const router = useRouter()

    // --- STATE ---
    const [list, setList] = useState<ITagihanVerifikasi[]>([])
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [name, setName] = useState("Kasir")
    const [kasirProfile, setKasirProfile] = useState<any>(null)

    // --- STATE MODAL & PROSES ---
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [selectedItem, setSelectedItem] = useState<ITagihanVerifikasi | null>(null)
    const [actionType, setActionType] = useState<'TERIMA' | 'TOLAK' | null>(null)
    const [catatan, setCatatan] = useState("")

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get("/tagihan/verifikasi")
            const data = res.data
            if (data.status) setList(data.data)
        } catch {
            toast.error("Gagal memuat data verifikasi")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const token = getAuthToken()
        const role = getUserRole()

        if (!token || role !== "KASIR") {
            router.push("/login")
            return
        }
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/user/${getUserId()}`)
                const data = res.data
                if (data.status) {
                    setName(data.data.name)
                    setKasirProfile(data.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchProfile()
        loadData()
    }, [router, loadData])

    const filteredList = list.filter(item => 
        item.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleLogout = () => {
        localStorage.clear()
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        router.push('/')
    }

    const openConfirmModal = (item: ITagihanVerifikasi, type: 'TERIMA' | 'TOLAK') => {
        setSelectedItem(item)
        setActionType(type)
        setCatatan("")
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedItem(null)
        setActionType(null)
    }

    const handleProcess = async () => {
        if (!selectedItem || !actionType) return;
        if (actionType === 'TOLAK' && catatan.trim().length < 5) {
            toast.error("Mohon isi alasan penolakan!");
            return;
        }

        setProcessing(true)
        try {
            const res = await api.put(`/tagihan/verifikasi/${selectedItem.id}`, { aksi: actionType, catatan })
            const data = res.data
            if (data.status) {
                toast.success(actionType === 'TERIMA' ? "Pembayaran Disetujui" : "Pembayaran Ditolak")
                setList(prev => prev.filter(i => i.id !== selectedItem.id))
                closeModal()
            } else toast.error(data.message)
        } catch { toast.error("Koneksi gagal") }
        finally { setProcessing(false) }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus antrean verifikasi ini secara manual? Tagihan tidak akan dihapus, hanya antrean verifikasi ini.")) return;

        try {
            const res = await api.delete(`/tagihan/verifikasi/${id}`)
            const data = res.data
            if (data.status) {
                toast.success("Antrean berhasil dihapus")
                setList(prev => prev.filter(i => i.id !== id))
            } else toast.error(data.message)
        } catch { toast.error("Gagal menghapus antrean") }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex transition-colors duration-300">

            {/* Sidebar Komponen */}
            <SidebarKasir 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={handleLogout} 
            />

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all">
                
                {/* Header Section */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Verifikasi Pembayaran</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Konfirmasi Transaksi</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Cari nama pelanggan..." 
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-11 h-11 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-200 ring-4 ring-white overflow-hidden relative">
                            {kasirProfile?.profile_picture ? (
                                <img 
                                    src={kasirProfile.profile_picture.startsWith('http') ? kasirProfile.profile_picture : `/api/uploads/${kasirProfile.profile_picture}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (name || "K").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
                    
                    {/* Status Ringkas */}
                    <div className="bg-blue-600 rounded-4xl p-8 text-white shadow-xl shadow-blue-100 flex items-center justify-between overflow-hidden relative">
                        <div className="z-10">
                            <h2 className="text-2xl font-black mb-1 tracking-tight">Antrean Verifikasi</h2>
                            <p className="text-blue-100 text-sm font-medium">Ada <span className="underline decoration-white/50">{list.length} transaksi</span> yang butuh tindakan Anda hari ini.</p>
                        </div>
                        <div className="z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                            <Clock size={32} className="text-white" />
                        </div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* List Cards */}
                    {loading ? (
                        <div className="py-20 text-center animate-pulse text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Sedang Menyelaraskan Data...</div>
                    ) : filteredList.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center transition-colors">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Tidak ada antrean</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Semua bukti pembayaran sudah terverifikasi.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredList.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-l-8 border-l-blue-500">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Bagian Gambar */}
                                        <div className="w-full lg:w-48 h-48 relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                                            <Image 
                                                src={item.bukti_bayar.startsWith('http') ? item.bukti_bayar : `/api/uploads/${item.bukti_bayar}`}
                                                alt="Bukti Transfer"
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                            <a 
                                                href={item.bukti_bayar.startsWith('http') ? item.bukti_bayar : `/api/uploads/${item.bukti_bayar}`} 
                                                target="_blank" 
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <ExternalLink className="text-white" size={24} />
                                            </a>
                                        </div>

                                        {/* Bagian Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                                <div>
                                                    <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">Nama Pelanggan</span>
                                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{item.userName}</h3>
                                                </div>
                                                <div className="text-left md:text-right">
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Periode Tagihan</span>
                                                    <p className="font-bold text-slate-600 dark:text-slate-300">{item.bulan} {item.tahun}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Nominal Transfer</p>
                                                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100">Rp {item.total_bayar.toLocaleString('id-ID')}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => openConfirmModal(item, 'TERIMA')}
                                                        className="flex-1 h-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95"
                                                    >
                                                        <CheckCircle size={18} /> Terima
                                                    </button>
                                                    <button 
                                                        onClick={() => openConfirmModal(item, 'TOLAK')}
                                                        className="flex-1 h-full bg-white dark:bg-transparent border-2 border-rose-100 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                                                    >
                                                        <XCircle size={18} /> Tolak
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all active:scale-95"
                                                        title="Hapus Antrean"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Konfirmasi */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden p-8 animate-in zoom-in-95 duration-200 transition-colors">
                        <div className="text-center mb-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${actionType === 'TERIMA' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'}`}>
                                {actionType === 'TERIMA' ? <CheckCircle size={40} /> : <XCircle size={40} />}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                {actionType === 'TERIMA' ? 'Konfirmasi Lunas' : 'Tolak Bukti Bayar'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                                Anda akan {actionType === 'TERIMA' ? 'mensahkan' : 'menolak'} pembayaran senilai <br/>
                                <span className="font-black text-slate-800 dark:text-slate-100">Rp {selectedItem.total_bayar.toLocaleString('id-ID')}</span>
                            </p>
                        </div>

                        {actionType === 'TOLAK' && (
                            <div className="mb-6">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 ml-1">Alasan Penolakan</label>
                                <textarea 
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none dark:text-slate-200"
                                    rows={3}
                                    placeholder="Contoh: Foto buram atau nominal tidak sesuai..."
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button 
                                onClick={closeModal}
                                className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleProcess}
                                disabled={processing}
                                className={`flex-2 py-4 rounded-2xl text-sm font-black text-white uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${actionType === 'TERIMA' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}
                                    ${processing ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {processing ? 'Memproses...' : (actionType === 'TERIMA' ? 'Sahkan Lunas' : 'Tolak Sekarang')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}