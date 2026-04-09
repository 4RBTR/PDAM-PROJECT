"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    MessageSquare,
    LogOut,
    X,
    Droplets,
    Users,
    Smartphone
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface SidebarProps {
    isOpen: boolean;          // Status: buka/tutup
    onClose: () => void;      // Fungsi tutup sidebar
    onLogout: () => void;     // Fungsi logout
}

export default function SidebarUser({ isOpen, onClose, onLogout }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useAuth()

    const menus = [
        { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard size={20} /> },
        { label: "Layanan Baru", href: "/user/layanan", icon: <Droplets size={20} /> },
        { label: "Pengaduan", href: "/user/pengaduan", icon: <MessageSquare size={20} /> },
        { label: "Profil Saya", href: "/user/profile", icon: <Users size={20} /> },
    ]

    return (
        <>
            {/* 1. OVERLAY / BACKDROP (Hanya di Mobile) */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
                `}
                onClick={onClose}
            ></div>

            {/* 2. SIDEBAR PANEL (Floating Card di Mobile, Fixed Full di Desktop) */}
            <aside
                className={`fixed z-50 bg-white dark:bg-slate-900 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    /* MOBILE STYLE (FLOATING CARD) */
                    top-4 bottom-4 left-4 w-[calc(100%-2rem)] max-w-70 rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]
                    ${isOpen ? "translate-x-0 scale-100 opacity-100" : "-translate-x-[120%] scale-95 opacity-0"}
                    /* DESKTOP STYLE (PERSISTENT & FIXED LEFT) */
                    lg:top-0 lg:bottom-0 lg:left-0 lg:w-72 lg:rounded-none lg:m-0 lg:h-full lg:shadow-none lg:border-r lg:border-slate-100/80 dark:lg:border-slate-800 lg:translate-x-0 lg:scale-100 lg:opacity-100 print:hidden
                `}
            >
                {/* HEADER: Logo & Tombol Close */}
                <div className="p-6 lg:p-8 border-b border-slate-100/60 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Logo yang diselaraskan dengan warna Banner Hero (#0A0F2C) */}
                        <div className="w-11 h-11 bg-[#0A0F2C] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-transparent"></div>
                            <Droplets size={22} className="text-blue-400 relative z-10" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-none tracking-tight">Hydro-FlowSystems</h1>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase mt-0.5 block">Pelanggan</span>
                        </div>
                    </div>

                    {/* Tombol Close (Hanya muncul di Mobile) */}
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-colors lg:hidden bg-slate-50/80 dark:bg-slate-800"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* MENU LIST */}
                <div className="flex-1 overflow-y-auto p-5 space-y-1.5 scrollbar-hide">
                    <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 mt-2">
                        Menu Navigasi
                    </p>

                    {menus.map((menu, index) => {
                        const isActive = pathname === menu.href
                        return (
                            <Link
                                key={index}
                                href={menu.href}
                                onClick={() => {
                                    // Tutup otomatis saat menu diklik (Hanya di layar Mobile)
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group
                                    ${isActive
                                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                                    }
                                `}
                            >
                                <span className={`${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110"} transition-all duration-300`}>
                                    {menu.icon}
                                </span>
                                {menu.label}
                            </Link>
                        )
                    })}
                </div>

                {/* FOOTER: User Profile & Logout */}
                <div className="p-5 border-t border-slate-100/60 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900 rounded-b-4xl lg:rounded-none space-y-4">
                    {/* User Profile Info */}
                    <Link 
                        href="/user/profile"
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 group"
                    >
                        <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-black overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm transition-transform group-hover:scale-105">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                (user?.name || "U").charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase leading-tight">{user?.name || "Memuat..."}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Lihat Profil</p>
                        </div>
                    </Link>

                    <button
                        onClick={() => { onClose(); onLogout(); }}
                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:border-rose-100 dark:hover:border-rose-800/50 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 px-4 py-3.5 rounded-2xl text-sm font-black transition-all shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] group"
                    >
                        <LogOut size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:-translate-x-1 transition-all" />
                        Keluar Aplikasi
                    </button>
                </div>
            </aside>
        </>
    )
}