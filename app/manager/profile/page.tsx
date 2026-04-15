"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SidebarManager from "@/components/Manager/SidebarManager"
import ProfileContent from "@/components/Profile/ProfileContent"
import { removeAuthToken } from "@/utils/cookies"
import { Menu } from "lucide-react"
import { useEffect } from "react"

export default function ManagerProfilePage() {
    const router = useRouter()
    const [managerName, setManagerName] = useState("Manager")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        setManagerName(localStorage.getItem("name") || "Manager")
    }, [])

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
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Profil Saya</h1>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Pengaturan Akun</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
                            {managerName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <ProfileContent role="Manager" />
            </main>
        </div>
    )
}
