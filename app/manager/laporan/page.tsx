"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
import {
    Search, FileText, Eye,
    ChevronLeft, ChevronRight, Menu, Download
} from "lucide-react"
import { getAuthToken, getUserRole, removeAuthToken } from "@/utils/cookies"
import SidebarManager from "@/components/Manager/SidebarManager"
import api from "@/lib/axios"
// html2canvas and jsPDF are dynamically imported in handleExportPDF to reduce bundle size

// Lazy load InvoiceModal
const InvoiceModal = dynamic(() => import("@/components/User/InvoiceModal"), {
    ssr: false,
    loading: () => null,
})

interface ITagihan {
    id: number;
    user: { name: string; email: string; address?: string };
    bulan: string;
    tahun: number;
    total_bayar: number;
    status_bayar: string;
    meter_awal: number;
    meter_akhir: number;
    updatedAt: string;
    userId: number;
}

export default function LaporanManager() {
    const [transaksi, setTransaksi] = useState<ITagihan[]>([])
    const [managerName, setManagerName] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Filter States
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [filterBulan, setFilterBulan] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Invoice modal
    const [selectedInvoice, setSelectedInvoice] = useState<ITagihan | null>(null)
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const token = getAuthToken()
        const role = getUserRole()
        const name = localStorage.getItem("name")

        if (!token || role !== "MANAGER") {
            router.replace("/login")
            return
        }

        if (name) setManagerName(name)
        fetchLaporanData()
    }, [router])

    const fetchLaporanData = async () => {
        try {
            const res = await api.get("/manager/dashboard")
            if (res.data.status) {
                setTransaksi(res.data.data)
            }
        } catch {
            toast.error("Gagal mengambil data laporan")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        removeAuthToken()
        localStorage.removeItem("name")
        router.push('/')
    }

    // --- FILTER LOGIC ---
    const filteredData = useMemo(() => {
        return transaksi.filter(item => {
            const matchSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toString().includes(searchTerm)
            const matchStatus = filterStatus === "ALL" || item.status_bayar === filterStatus
            const matchBulan = filterBulan === "ALL" || item.bulan === filterBulan
            return matchSearch && matchStatus && matchBulan
        })
    }, [transaksi, searchTerm, filterStatus, filterBulan])

    const ringkasan = useMemo(() => {
        const totalUang = filteredData.reduce((acc, curr) => curr.status_bayar === 'LUNAS' ? acc + curr.total_bayar : acc, 0)
        const totalAir = filteredData.reduce((acc, curr) => acc + (curr.meter_akhir - curr.meter_awal), 0)
        return { totalUang, totalAir, totalTrx: filteredData.length }
    }, [filteredData])

    const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

    // Pagination
    useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus, filterBulan])
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))

    // Export full table to PDF
    const handleExportPDF = async () => {
        const tableEl = document.getElementById("laporan-table")
        if (!tableEl) return
        const loadingToast = toast.loading("Membuat laporan PDF...")
        try {
            const html2canvas = (await import("html2canvas-pro")).default
            const { default: jsPDF } = await import("jspdf")
            const canvas = await html2canvas(tableEl, { scale: 2, logging: false, backgroundColor: "#ffffff" })
            const imgData = canvas.toDataURL("image/png", 1.0)
            const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight, undefined, 'FAST')
            pdf.save(`Laporan_HydroFlow_${new Date().toISOString().slice(0, 10)}.pdf`)
            toast.success("Laporan PDF berhasil diunduh!", { id: loadingToast })
        } catch {
            toast.error("Gagal membuat PDF.", { id: loadingToast })
        }
    }

    const handleViewInvoice = (item: ITagihan) => {
        setSelectedInvoice(item)
        setIsInvoiceOpen(true)
    }

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <SidebarManager
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300 overflow-hidden">
                {/* Header */}
                <header className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">Laporan Tahunan</h1>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Executive Reporting</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
                            {managerName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">

                    {/* Title */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <FileText className="text-indigo-600 dark:text-indigo-400" /> Laporan Transaksi Detail
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Data riil penggunaan air dan status keuangan pelanggan.</p>
                        </div>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
                        >
                            <Download size={18} /> Export PDF
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Pendapatan (Lunas)</p>
                            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatRp(ringkasan.totalUang)}</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Konsumsi Air</p>
                            <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400">{ringkasan.totalAir} m³</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Jumlah Transaksi</p>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{ringkasan.totalTrx} Baris</h3>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6 transition-colors">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari Pelanggan..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="LUNAS">Lunas</option>
                                <option value="BELUM_BAYAR">Belum Bayar</option>
                                <option value="MENUNGGU_VERIFIKASI">Verifikasi</option>
                            </select>
                            <select
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none"
                                value={filterBulan}
                                onChange={(e) => setFilterBulan(e.target.value)}
                            >
                                <option value="ALL">Semua Bulan</option>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold italic">
                                *Data sinkron otomatis dengan server
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div id="laporan-table" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Detail Pelanggan</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Periode</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">Meter</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">Konsumsi</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Total Tagihan</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i}>
                                                <td colSpan={7} className="px-6 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-16 text-center">
                                                <p className="text-slate-400 font-bold">Tidak ada data ditemukan</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.user.name}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">TRX-ID: {item.id}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {item.bulan} {item.tahun}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-mono text-slate-500 dark:text-slate-400">
                                                    {item.meter_awal} - {item.meter_akhir}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-lg text-xs font-black">
                                                        {item.meter_akhir - item.meter_awal} m³
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                                                    {formatRp(item.total_bayar)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                        item.status_bayar === 'LUNAS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                                                        item.status_bayar === 'MENUNGGU_VERIFIKASI' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                                        'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                                                    }`}>
                                                        {item.status_bayar.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleViewInvoice(item)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                            item.status_bayar === 'LUNAS' 
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50' 
                                                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                        }`}
                                                    >
                                                        <Eye size={14} /> {item.status_bayar === 'LUNAS' ? 'Invoice' : 'Tagihan'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                Menampilkan {currentItems.length} dari {filteredData.length} Data
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="flex items-center px-3 text-sm font-medium text-slate-500">
                                    {currentPage}/{totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Invoice Modal */}
            {selectedInvoice && (
                <InvoiceModal
                    isOpen={isInvoiceOpen}
                    onClose={() => setIsInvoiceOpen(false)}
                    data={selectedInvoice}
                    user={{
                        name: selectedInvoice.user.name,
                        address: selectedInvoice.user.address || selectedInvoice.user.email,
                        id: String(selectedInvoice.userId || selectedInvoice.id)
                    }}
                />
            )}
        </div>
    )
}