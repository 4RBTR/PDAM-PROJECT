"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export default function GlobalWidget() {
    const [mounted, setMounted] = useState(false)
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
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-lg px-4 py-2 rounded-2xl flex items-center gap-3 transition-colors duration-300">
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

            
        </div>
    )
}
