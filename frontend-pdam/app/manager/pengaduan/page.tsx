"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    ArrowLeft,
    Search,
    Trash2,
    Mail,
    Clock,
    MessageSquare,
    RefreshCcw,
    Inbox
} from "lucide-react"

// 👇 Import Helper Cookies
import { getAuthToken, getUserRole } from "@/utils/cookies"

interface IPengaduan {
    id: number;
    nama: string;
    email: string;
    pesan: string;
    isRead: boolean;
    createdAt: string;
}

// --- Komponen Skeleton Loading ---
const InboxSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            <div className="h-3 w-48 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-xl w-full"></div>
            </div>
        ))}
    </div>
)

export default function ManagerInbox() {
    const [messages, setMessages] = useState<IPengaduan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("") // Fitur Search
    const router = useRouter()

    useEffect(() => {
        const token = getAuthToken()
        const role = getUserRole()

        if (!token) {
            router.push("/login")
            return
        }

        if (role !== "MANAGER") {
            toast.error("Akses Ditolak")
            router.push("/login")
            return
        }

        fetchMessages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const token = getAuthToken();
            const res = await fetch("http://localhost:8000/manager/pengaduan", {
                headers: { "Authorization": `Bearer ${token}` }
            })

            const data = await res.json()
            if (data.status) {
                setMessages(data.data)
            }
        } catch (error) {
            console.error("Error", error)
            toast.error("Gagal sinkronisasi pesan.")
        } finally {
            setLoading(false)
        }
    }

    // --- Filter Logic ---
    const filteredMessages = useMemo(() => {
        return messages.filter(msg =>
            msg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.pesan.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [messages, searchTerm])

    // --- Logic Hapus ---
    const executeDelete = async (id: number) => {
        const toastId = toast.loading("Menghapus pesan...")
        const token = getAuthToken();

        try {
            const res = await fetch(`http://localhost:8000/manager/pengaduan/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()

            if (data.status) {
                setMessages(prev => prev.filter(msg => msg.id !== id))
                toast.success("Pesan dihapus", { id: toastId })
            } else {
                toast.error(data.message, { id: toastId })
            }
        } catch (error) {
            console.error(error)
            toast.error("Gagal menghapus", { id: toastId })
        }
    }

    const handleDelete = (id: number) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-slate-100`}>
                <div className="p-4 flex gap-4">
                    <div className="shrink-0">
                        <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                            <Trash2 size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Hapus Pesan?</p>
                        <p className="mt-1 text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                </div>
                <div className="flex bg-slate-50 border-t border-slate-100">
                    <button onClick={() => toast.dismiss(t.id)} className="w-full py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
                        Batal
                    </button>
                    <button onClick={() => { toast.dismiss(t.id); executeDelete(id); }} className="w-full py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition border-l border-slate-100">
                        Hapus
                    </button>
                </div>
            </div>
        ))
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-12">

            {/* --- TOPBAR --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-sm">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/manager/dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-bold text-lg text-slate-900 leading-none">Kotak Masuk</h1>
                            <span className="text-[10px] font-medium text-slate-400">Pusat Pengaduan</span>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchMessages()}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </nav>

            <main className="px-4 py-8 max-w-4xl mx-auto space-y-6">

                {/* --- HEADER & SEARCH --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <span>📬</span> Pesan Pelanggan
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Kelola aspirasi dan keluhan pelanggan.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cari pengirim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* --- CONTENT --- */}
                {loading ? (
                    <InboxSkeleton />
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <Inbox size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-600 font-bold">Tidak ada pesan ditemukan</p>
                        <p className="text-slate-400 text-sm">Kotak masuk Anda bersih.</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 text-indigo-600 text-sm hover:underline"
                            >
                                Hapus pencarian
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((msg) => (
                            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition group relative">

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 shadow-lg">
                                            {msg.nama.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{msg.nama}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <Mail size={12} />
                                                <span>{msg.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <Clock size={10} />
                                            {formatDate(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Body Pesan */}
                                <div className="pl-0 md:pl-16">
                                    <div className="bg-slate-50/80 p-5 rounded-2xl rounded-tl-none text-slate-700 text-sm leading-relaxed border border-slate-100 relative">
                                        <MessageSquare size={16} className="absolute -top-3 left-0 text-slate-300 transform -scale-x-100" />
                                        &quot;{msg.pesan}&quot;
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex justify-end gap-2 pl-0 md:pl-16 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition"
                                    >
                                        <Trash2 size={14} />
                                        Hapus
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}