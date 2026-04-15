"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SidebarUser from "@/components/User/SidebarUser"
import ProfileContent from "@/components/Profile/ProfileContent"
import { getAuthToken } from "@/utils/cookies"
import { useAuth } from "@/context/AuthContext"
import { Menu } from "lucide-react"

export default function UserProfilePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const token = getAuthToken()
        if (!token) router.push("/login")
    }, [router])

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex overflow-x-hidden transition-colors duration-300">
            <SidebarUser 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={logout} 
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 pb-24">
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex items-center sticky top-0 z-20 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                        <Menu size={24} />
                    </button>
                    <h1 className="ml-4 font-extrabold text-lg">Profil Saya</h1>
                </header>

                <ProfileContent role="Pelanggan" />
                
                <div className="text-center mt-auto py-8 text-slate-400 dark:text-slate-500 text-sm font-medium">
                    <p>&copy; {new Date().getFullYear()} Hydro-FlowSystems.</p>
                </div>
            </main>
        </div>
    )
}
