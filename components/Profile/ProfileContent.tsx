"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { 
    User, Mail, Phone, MapPin, Lock, 
    Camera, Save, Loader2, ArrowLeft 
} from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function ProfileContent({ role }: { role: string }) {
    const { user: authUser, refreshUser } = useAuth()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone: authUser?.phone || "",
        address: authUser?.address || "",
        profile_picture: authUser?.profile_picture || "",
        password: ""
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(authUser?.profile_picture || null)

    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name,
                email: authUser.email,
                phone: authUser.phone || "",
                address: authUser.address || "",
                profile_picture: authUser.profile_picture || "",
                password: ""
            })
            setImagePreview(authUser.profile_picture)
        }
    }, [authUser])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // VALIDASI NOMOR TELEPON (Harus 12 angka, mulai 08 atau 62)
        const phone = formData.phone || ""
        const phoneDigits = phone.replace(/\D/g, "") // Hanya ambil angka
        
        if (phoneDigits.length !== 12) {
            toast.error("Nomor WhatsApp harus tepat 12 angka")
            setSaving(false)
            return
        }

        if (!phoneDigits.startsWith("08") && !phoneDigits.startsWith("62")) {
            toast.error("Nomor harus diawali dengan 08 atau 62")
            setSaving(false)
            return
        }

        try {
            let currentProfilePicture = formData.profile_picture

            // 1. Upload new image if selected
            if (selectedImage) {
                const imgData = new FormData()
                imgData.append("image", selectedImage)
                
                const uploadRes = await api.post("/user/upload-profile", imgData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                
                if (uploadRes.data.status) {
                    currentProfilePicture = uploadRes.data.data.url
                } else {
                    toast.error("Gagal upload foto profil")
                }
            }

            // 2. Update user data
            const res = await api.put(`/user/${authUser?.id}`, {
                ...formData,
                profile_picture: currentProfilePicture
            })
            
            if (res.data.status) {
                toast.success("Profil berhasil diperbarui!")
                await refreshUser() // Sinkronisasi ke Navbar!
                setSelectedImage(null)
            } else {
                toast.error(res.data.message || "Gagal memperbarui profil")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan koneksi")
        } finally {
            setSaving(false)
        }
    }

    if (!authUser) {
        return (
            <div className="flex-1 flex items-center justify-center p-20">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto w-full p-6 lg:p-10">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <User size={24} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Pengaturan Profil</h1>
                    <p className="text-sm text-slate-500 font-medium">Kelola informasi pribadi dan keamanan akun Anda.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Bagian Foto */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-indigo-600"></div>
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-all active:scale-95 group-hover:scale-110">
                                <Camera size={18} />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedImage(file)
                                            setImagePreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{authUser.name}</h3>
                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">{role}</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/40">
                        <h4 className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Lock size={14} /> Keamanan Akun
                        </h4>
                        <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 font-medium leading-relaxed">
                            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda. Jangan bagikan email kepada orang lain.
                        </p>
                    </div>
                </div>

                {/* Bagian Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Alamat Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required disabled value={formData.email} type="email" className="w-full pl-12 pr-5 py-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-slate-500 cursor-not-allowed text-sm font-bold" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">
                                    Nomor WhatsApp <span className="text-slate-400 font-medium normal-case">(12 Angka, mulai 08/62)</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Alamat Lengkap</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea required rows={3} value={formData.address || ""} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold resize-none" />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block ml-1">Ganti Password <span className="text-slate-400 font-medium normal-case">(Kosongkan jika tidak diganti)</span></label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type="password" placeholder="••••••••" className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
