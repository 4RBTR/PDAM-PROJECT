"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import SidebarKasir from "@/components/Kasir/SidebarKasir"
import { getUserRole } from "@/utils/cookies"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import {
    Users, Search, UserPlus, Edit3, Trash2,
    MapPin, RefreshCw, X, Eye, Phone
} from "lucide-react"
import Image from "next/image"

interface Pelanggan {
    id: number
    name: string
    email: string
    address: string
    phone: string | null
    profile_picture: string | null
}

export default function KelolaPelangganPage() {
    const { user: authUser, logout } = useAuth()
    const [pelanggan, setPelanggan] = useState<Pelanggan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // State untuk Form (Tambah/Edit)
    const [showForm, setShowForm] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [formUser, setFormUser] = useState({
        name: "", email: "", password: "", address: "", phone: "", profile_picture: ""
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const router = useRouter()
    // API_URL dimigrasikan ke lib/axios.ts

    // --- FETCH DATA ---
    const fetchPelanggan = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get("/users/pelanggan")
            const data = res.data
            if (data.status) setPelanggan(data.data)
        } catch {
            toast.error("Gagal memuat data pelanggan")
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
        fetchPelanggan()
    }, [router, fetchPelanggan])

    // --- FILTER ---
    const filteredPelanggan = useMemo(() => {
        return pelanggan.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [pelanggan, searchTerm])

    // --- ACTIONS ---
    const handleOpenDetails = (p: Pelanggan) => {
        setSelectedPelanggan(p)
        setShowDetails(true)
    }

    const handleOpenAdd = () => {
        setEditId(null)
        setFormUser({ name: "", email: "", password: "", address: "", phone: "", profile_picture: "" })
        setSelectedImage(null)
        setImagePreview(null)
        setShowForm(true)
    }

    const handleOpenEdit = (p: Pelanggan) => {
        setEditId(p.id)
        setFormUser({ 
            name: p.name, 
            email: p.email, 
            address: p.address, 
            password: "", 
            phone: p.phone || "", 
            profile_picture: p.profile_picture || "" 
        })
        setImagePreview(p.profile_picture || null)
        setSelectedImage(null)
        setShowForm(true)
    }

    const handleDelete = (id: number) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-bold text-slate-800 text-sm">Hapus pelanggan ini?</p>
                <div className="flex gap-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-slate-100 rounded-md text-xs font-bold">Batal</button>
                    <button onClick={async () => {
                        toast.dismiss(t.id)
                        const load = toast.loading("Menghapus...")
                        try {
                            const res = await api.delete(`/user/${id}`)
                            const data = res.data
                            if (data.status) {
                                toast.success("Berhasil dihapus", { id: load })
                                fetchPelanggan()
                            } else toast.error(data.message, { id: load })
                        } catch { toast.error("Error koneksi", { id: load }) }
                    }} className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold">Hapus</button>
                </div>
            </div>
        ), { duration: 5000 })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const loadingToast = toast.loading("Menyimpan...")
        try {
            let currentProfilePicture = formUser.profile_picture;

            // Upload image if selected
            if (selectedImage) {
                const formData = new FormData()
                formData.append("image", selectedImage)
                
                const uploadRes = await api.post("/user/upload-profile", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                const uploadData = uploadRes.data
                if (uploadData.status) {
                    currentProfilePicture = uploadData.data.url
                } else {
                    toast.error("Gagal upload foto profil")
                }
            }

            const bodyData = { 
                ...formUser, 
                profile_picture: currentProfilePicture,
                role: 'PELANGGAN' 
            } as Record<string, unknown>
            
            if (editId && !formUser.password) delete bodyData.password

            let res;
            if (editId) {
                res = await api.put(`/user/${editId}`, bodyData)
            } else {
                res = await api.post("/user", bodyData)
            }
            const data = res.data
            toast.dismiss(loadingToast)

            if (data.status) {
                toast.success(editId ? "Data diperbarui" : "Pelanggan baru ditambahkan")
                setShowForm(false)
                fetchPelanggan()
            } else toast.error(data.message)
        } catch { 
            toast.dismiss(loadingToast)
            toast.error("Koneksi gagal") 
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden transition-colors duration-300">

            {/* SIDEBAR */}
            <SidebarKasir
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={logout}
            />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72">

                {/* HEADER */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <Users size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Database Pelanggan</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Hydro-Flow Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleOpenAdd}
                            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <UserPlus size={18} /> Tambah Pelanggan
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
                                (authUser?.name || "K").charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-6 lg:space-y-8">

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-5 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Pelanggan</p>
                                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{pelanggan.length} <span className="text-sm font-normal text-slate-400 dark:text-slate-500 italic">Orang</span></p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-5 transition-colors">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                                <RefreshCw size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status Sistem</p>
                                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Sinkron</p>
                            </div>
                        </div>
                    </div>

                    {/* FILTER & SEARCH */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all shadow-sm text-sm dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                        <button onClick={fetchPelanggan} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
                        {loading ? (
                            <div className="p-20 text-center text-slate-400 dark:text-slate-500 font-medium">Memuat data...</div>
                        ) : filteredPelanggan.length === 0 ? (
                            <div className="p-20 text-center">
                                <Users size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                                <p className="text-slate-400 dark:text-slate-500 font-bold">Pelanggan tidak ditemukan.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Profil Pelanggan</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Alamat</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredPelanggan.map((p) => (
                                            <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {p.profile_picture ? (
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                                                                <Image 
                                                                    src={p.profile_picture.startsWith('http') ? p.profile_picture : `/api/uploads/${p.profile_picture}`} 
                                                                    alt={p.name} 
                                                                    width={40}
                                                                    height={40}
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                                                                {p.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{p.name}</p>
                                                            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{p.phone || p.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2 max-w-[200px] lg:max-w-xs">
                                                        <MapPin size={12} className="text-slate-300 dark:text-slate-600 mt-1 shrink-0" />
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{p.address}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenDetails(p)} className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors" title="Lihat Detail">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button onClick={() => handleOpenEdit(p)} className="p-2 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg transition-colors">
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
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

            {/* MODAL FORM */}
            {showForm && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                {editId ? 'Edit Pelanggan' : 'Daftar Pelanggan Baru'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                                    {imagePreview ? (
                                        <Image 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <UserPlus size={24} className="text-slate-400" />
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedImage(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Nama Lengkap</label>
                                        <input required value={formUser.name} onChange={e => setFormUser({ ...formUser, name: e.target.value })} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium dark:text-slate-200" placeholder="Nama pelanggan..." />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Email Aktif</label>
                                        <input required value={formUser.email} onChange={e => setFormUser({ ...formUser, email: e.target.value })} type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium dark:text-slate-200" placeholder="email@contoh.com" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Nomor WhatsApp</label>
                                    <input required value={formUser.phone} onChange={e => setFormUser({ ...formUser, phone: e.target.value })} type="tel" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium dark:text-slate-200" placeholder="0812..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                                        Password {editId && <span className="text-[9px] text-rose-400 dark:text-rose-500">(Opsional)</span>}
                                    </label>
                                    <input required={!editId} value={formUser.password} onChange={e => setFormUser({ ...formUser, password: e.target.value })} type="password" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium dark:text-slate-200" placeholder="Min 6 karakter..." />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Alamat Lengkap</label>
                                <textarea required value={formUser.address} onChange={e => setFormUser({ ...formUser, address: e.target.value })} rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium resize-none dark:text-slate-200" placeholder="Alamat pelanggan..."></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Batal</button>
                                <button type="submit" className="flex-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95">
                                    {editId ? 'Simpan Perubahan' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETAILS */}
            {showDetails && selectedPelanggan && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center transition-colors">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Profil Pelanggan</h3>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-0.5">Hydro-Flow Directory</p>
                            </div>
                            <button onClick={() => setShowDetails(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-4 relative">
                                    {selectedPelanggan.profile_picture ? (
                                        <Image 
                                            src={selectedPelanggan.profile_picture.startsWith('http') ? selectedPelanggan.profile_picture : `/api/uploads/${selectedPelanggan.profile_picture}`} 
                                            alt={selectedPelanggan.name} 
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl">
                                            {selectedPelanggan.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">{selectedPelanggan.name}</h4>
                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">ID: #{selectedPelanggan.id}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-slate-400 shrink-0">
                                        <Search size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{selectedPelanggan.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{selectedPelanggan.phone || "Tidak tersedia"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-amber-500 shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Address</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{selectedPelanggan.address || "Alamat belum diatur"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => setShowDetails(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}