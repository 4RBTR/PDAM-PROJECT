"use client"

import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

interface ITagihan {
    id: number;
    user: { name: string; email: string };
    bulan: string;
    tahun: number;
    total_bayar: number;
    status_bayar: string;
    meter_awal: number;
    meter_akhir: number;
}

interface TransactionTableProps {
    items: ITagihan[];
    searchTerm: string;
    onSearchChange: (val: string) => void;
    filterStatus: string;
    onFilterChange: (val: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    formatRp: (n: number) => string;
}

export default function TransactionTable({
    items, searchTerm, onSearchChange, filterStatus, onFilterChange,
    currentPage, totalPages, onPageChange, formatRp
}: TransactionTableProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white dark:bg-slate-900">
                <div>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">Riwayat Transaksi</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor aktivitas pembayaran tagihan terkini.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama / ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 w-full sm:w-64 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={filterStatus}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 appearance-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <option value="ALL">Semua Status</option>
                            <option value="LUNAS">Lunas</option>
                            <option value="BELUM_BAYAR">Belum Bayar</option>
                            <option value="MENUNGGU_VERIFIKASI">Verifikasi</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Pelanggan</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Periode</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Pemakaian</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Total Tagihan</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                                            <Search size={28} className="text-slate-400" />
                                        </div>
                                        <h4 className="text-slate-900 dark:text-slate-100 font-extrabold text-lg">Tidak ada data ditemukan</h4>
                                        <p className="text-slate-500 text-sm mt-1">Coba gunakan kata kunci pencarian yang berbeda atau pastikan ada data dari server.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-100 dark:border-indigo-800/50">
                                                {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.user?.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">ID: {item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.bulan} {item.tahun}</span>
                                            <span className="text-xs text-slate-400 font-medium">{item.user?.email || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold border border-slate-200 dark:border-slate-700">
                                            {(item.meter_akhir || 0) - (item.meter_awal || 0)} m³
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{formatRp(item.total_bayar)}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.status_bayar === 'LUNAS' && (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-sm dark:shadow-none">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LUNAS
                                            </span>
                                        )}
                                        {item.status_bayar === 'MENUNGGU_VERIFIKASI' && (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800/50 shadow-sm dark:shadow-none">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> VERIFIKASI
                                            </span>
                                        )}
                                        {item.status_bayar === 'BELUM_BAYAR' && (
                                            <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-800/50 shadow-sm dark:shadow-none">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> PENDING
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300 font-semibold text-sm flex items-center gap-1"
                >
                    <ChevronLeft size={16} /> Prev
                </button>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Hal <span className="text-slate-900 dark:text-slate-100 font-bold mx-1">{currentPage}</span> dari {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300 font-semibold text-sm flex items-center gap-1"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}
