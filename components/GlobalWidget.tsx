"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Clock } from "lucide-react"

export default function GlobalWidget() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    // Menyelesaikan masalah hidrasi Next.js
    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!mounted) return null // Jangan render di server untuk menghindari mismatch

    // Format tanggal dan waktu
    const formattedTime = currentTime
        ? currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : "..."
    
    const formattedDate = currentTime
        ? currentTime.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
        : "..."

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500 print:hidden">
            
            {/* Widget Jam Realtime */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg px-4 py-2 rounded-2xl flex items-center gap-3 transition-colors duration-300">
                <div className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg">
                    <Clock size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 tabular-nums leading-none mb-1">
                        {formattedTime}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                        {formattedDate}
                    </span>
                </div>
            </div>

            {/* Tombol Tema */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg p-3 rounded-2xl text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group flex items-center justify-center"
                aria-label="Toggle Theme"
            >
                {theme === "dark" ? (
                    <Sun size={20} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                    <Moon size={20} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform duration-500 text-slate-600" />
                )}
            </button>
            
        </div>
    )
}
