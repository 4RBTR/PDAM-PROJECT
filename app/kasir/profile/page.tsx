"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SidebarKasir from "@/components/Kasir/SidebarKasir"
import ProfileContent from "@/components/Profile/ProfileContent"
import { getAuthToken } from "@/utils/cookies"
import { Menu } from "lucide-react"

export default function KasirProfilePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = getAuthToken()
        if (!token) router.push("/login")
    }, [router])

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden transition-colors duration-300">
            <SidebarKasir 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={() => router.push("/")} 
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24">
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Profil Saya</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Pengaturan Akun</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-200 ring-4 ring-white">
                            K
                        </div>
                    </div>
                </header>

                <ProfileContent role="Kasir" />
            </main>
        </div>
    )
}
