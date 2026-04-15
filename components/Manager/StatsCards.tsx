"use client"

import { Wallet, Droplets, Users, TrendingUp } from "lucide-react"

interface IStats {
    total_pendapatan: number;
    total_pelanggan: number;
    transaksi_lunas: number;
    transaksi_tunggakan: number;
    total_air: number;
    unread_pengaduan: number;
}

interface StatsCardsProps {
    stats: IStats | null;
    formatRp: (n: number) => string;
}

export default function StatsCards({ stats, formatRp }: StatsCardsProps) {
    const collectionRate = stats
        ? Math.round(((stats.transaksi_lunas || 0) / (((stats.transaksi_lunas || 0) + (stats.transaksi_tunggakan || 0)) || 1)) * 100)
        : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card 1: Pendapatan */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Wallet size={24} strokeWidth={2} />
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-indigo-100 dark:border-indigo-800/50">
                            Total Kas
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Pendapatan</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{formatRp(stats?.total_pendapatan || 0)}</h3>
                </div>
            </div>

            {/* Card 2: Volume Air */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 dark:bg-sky-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-linear-to-br from-sky-400 to-sky-500 p-3.5 rounded-2xl text-white shadow-lg shadow-sky-200 dark:shadow-none">
                            <Droplets size={24} strokeWidth={2} />
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Volume Terjual</p>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats?.total_air?.toLocaleString('id-ID') || 0}</h3>
                        <span className="text-base font-bold text-slate-400 dark:text-slate-500">m³</span>
                    </div>
                </div>
            </div>

            {/* Card 3: Pelanggan */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-linear-to-br from-purple-500 to-purple-600 p-3.5 rounded-2xl text-white shadow-lg shadow-purple-200 dark:shadow-none">
                            <Users size={24} strokeWidth={2} />
                        </div>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Pelanggan</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats?.total_pelanggan || 0}</h3>
                </div>
            </div>

            {/* Card 4: Progress */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 dark:bg-rose-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-linear-to-br from-rose-400 to-rose-500 p-3.5 rounded-2xl text-white shadow-lg shadow-rose-200 dark:shadow-none">
                            <TrendingUp size={24} strokeWidth={2} />
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-rose-100 dark:border-rose-800/50">
                            {stats?.transaksi_tunggakan || 0} Pending
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex justify-between text-xs mb-2 font-bold text-slate-500">
                            <span className="uppercase tracking-wider">Collection Rate</span>
                            <span className="text-slate-800 dark:text-slate-100">{collectionRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700">
                            <div className="bg-linear-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${collectionRate}%` }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
