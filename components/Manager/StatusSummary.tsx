"use client"

import { Activity } from "lucide-react"
import { useRouter } from "next/navigation"

interface IStats {
    transaksi_lunas: number;
    transaksi_tunggakan: number;
}

interface StatusSummaryProps {
    stats: IStats | null;
}

export default function StatusSummary({ stats }: StatusSummaryProps) {
    const router = useRouter()

    return (
        <div className="bg-[#0B1120] text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-900/20 border border-slate-800">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-extrabold text-2xl mb-1 tracking-tight">Status Kas</h3>
                        <p className="text-slate-400 text-sm font-medium">Rekapitulasi Transaksi</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                        <Activity size={20} className="text-indigo-400" />
                    </div>
                </div>

                <div className="mt-10 space-y-4">
                    <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between border border-slate-700/50 hover:bg-slate-800 transition-colors group cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
                            <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Telah Lunas</span>
                        </div>
                        <span className="font-black text-lg text-emerald-400">{stats?.transaksi_lunas || 0} <span className="text-xs text-slate-500 font-semibold ml-1">TRX</span></span>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between border border-slate-700/50 hover:bg-slate-800 transition-colors group cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]"></div>
                            <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Belum Bayar / Verifikasi</span>
                        </div>
                        <span className="font-black text-lg text-rose-400">{stats?.transaksi_tunggakan || 0} <span className="text-xs text-slate-500 font-semibold ml-1">TRX</span></span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80">
                <button
                    onClick={() => router.push(`/manager/laporan`)}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                    Lihat Detail Laporan
                </button>
            </div>
        </div>
    )
}
