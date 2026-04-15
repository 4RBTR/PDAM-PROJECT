"use client"

import { FileText, AlertCircle, Clock, Headphones, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserStatsCardsProps {
    totalTagihan: number;
    belumLunas: number;
    menunggu: number;
}

export default function UserStatsCards({ totalTagihan, belumLunas, menunggu }: UserStatsCardsProps) {
    const router = useRouter()

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 print:hidden">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FileText size={24} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Semua Tagihan</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{totalTagihan}</p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                        <AlertCircle size={24} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Belum Lunas</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{belumLunas}</p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                        <Clock size={24} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">Verifikasi</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{menunggu}</p>
                </div>
            </div>

            {/* Action Card */}
            <div
                onClick={() => router.push('/user/pengaduan')}
                className="cursor-pointer bg-slate-900 p-6 rounded-4xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col justify-between h-36 text-white hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-700/50 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Headphones size={24} strokeWidth={2.5} />
                    </div>
                    <ArrowRight className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Bantuan</p>
                    <p className="text-xl font-black leading-tight">Buat Laporan</p>
                </div>
            </div>
        </div>
    )
}
