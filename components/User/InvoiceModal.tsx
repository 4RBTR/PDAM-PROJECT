"use client"

import React, { useRef } from "react"
import { X, Download, Printer, Droplets, CheckCircle2, ArrowRight } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import toast from "react-hot-toast"

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        id: number;
        bulan: string;
        tahun: number;
        meter_awal: number;
        meter_akhir: number;
        total_bayar: number;
        status_bayar: string;
    };
    user: {
        name: string;
        address: string;
        id: string;
    };
}

export default function InvoiceModal({ isOpen, onClose, data, user }: InvoiceModalProps) {
    const invoiceRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return
        
        const loadingToast = toast.loading("Menyiapkan berkas PDF...")
        try {
            const element = invoiceRef.current
            const canvas = await html2canvas(element, {
                scale: 3, // Premium HD quality
                logging: false,
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const clonedInvoice = clonedDoc.getElementById("printable-invoice")
                    if (clonedInvoice) {
                        // Standardize for PDF rendering
                        clonedInvoice.style.boxShadow = "none"
                        clonedInvoice.style.borderRadius = "0"
                        clonedInvoice.style.margin = "0"
                        clonedInvoice.style.transform = "none"
                    }
                }
            })
            
            const imgData = canvas.toDataURL("image/png", 1.0)
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })
            
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
            pdf.save(`Invoice_HydroFlow_${data.bulan}_${data.tahun}_${user.name.replace(/\s+/g, '_')}.pdf`)
            
            toast.success("PDF berhasil diunduh!", { id: loadingToast })
        } catch (error) {
            console.error("PDF Export Error:", error)
            toast.error("Gagal mengunduh PDF. Coba gunakan fitur Cetak.", { id: loadingToast })
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const usage = data.meter_akhir - data.meter_awal

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Modal */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Invoice Digital</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Status: <span className="text-emerald-600 font-bold uppercase tracking-widest">{data.status_bayar}</span></p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>


                {/* Printable Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-10 bg-slate-500/10 dark:bg-slate-950/50 scrollbar-hide">
                    <div 
                        ref={invoiceRef}
                        className="bg-white text-slate-900 p-6 md:p-16 shadow-2xl rounded-4xl mx-auto w-full lg:max-w-[210mm] min-h-auto lg:min-h-[297mm] flex flex-col relative overflow-hidden print:shadow-none print:m-0 print:rounded-none print:p-12 transition-all"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                        id="printable-invoice"
                    >
                        {/* Premium Pattern Decoration (Subtle) */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 opacity-50"></div>

                        {/* Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#0A0F2C]"></div>

                        {/* Header Invoice */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-slate-100 pb-12 mb-12">
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0A0F2C] rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/30 shrink-0">
                                    <Droplets size={32} className="text-blue-400" strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl md:text-3xl font-black tracking-tighter leading-none text-[#0A0F2C] truncate">Hydro-FlowSystems</h1>
                                    <p className="text-[10px] md:text-xs text-blue-600 font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mt-1 md:mt-2">Official Receipt</p>
                                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest truncate">Secure Billing</p>
                                </div>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto">
                                <h2 className="text-3xl md:text-5xl font-black text-slate-100 tracking-widest md:tracking-[0.2em] uppercase leading-none mb-3 md:mb-4">INVOICE</h2>
                                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-black tracking-widest">
                                    #{String(data.id).padStart(6, '0')}
                                </div>
                            </div>
                        </div>

                        {/* Info Section Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Customer Details</p>
                                <div>
                                    <p className="font-black text-xl text-slate-900 leading-tight mb-1">{user.name}</p>
                                    <p className="text-[11px] font-black text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded uppercase mb-2">Member ID: #{String(user.id).padStart(5, '0')}</p>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{user.address}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Billing Period</p>
                                <div>
                                    <p className="font-black text-2xl text-slate-900 uppercase tracking-tighter">{data.bulan}</p>
                                    <p className="text-xl font-bold text-slate-400 mt-0.5">Year {data.tahun}</p>
                                </div>
                            </div>
                            <div className="text-left md:text-right space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Issue Date</p>
                                <div>
                                    <p className="font-black text-lg text-slate-900">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Electronic Receipt</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Breakdown Table */}
                        <div className="flex-1 overflow-x-auto scrollbar-hide">
                            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 min-w-[500px] md:min-w-0">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900 text-white">
                                            <th className="py-4 md:py-5 px-6 md:px-8 text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest">Service Description</th>
                                            <th className="py-4 md:py-5 px-6 md:px-8 text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest">Meter Details</th>
                                            <th className="py-4 md:py-5 px-6 md:px-8 text-right text-[9px] md:text-[10px] font-black uppercase tracking-widest">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="py-8 md:py-10 px-6 md:px-8">
                                                <p className="font-black text-base md:text-lg text-slate-900">Usage Consumption</p>
                                                <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 italic leading-relaxed">Standard Rate ({usage} m³ @ Rp 5k)</p>
                                            </td>
                                            <td className="py-8 md:py-10 px-6 md:px-8 text-center">
                                                <div className="inline-flex flex-col items-center bg-white border border-slate-200 p-3 md:p-4 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-black text-slate-900">
                                                        <span className="text-slate-400">{data.meter_awal}</span>
                                                        <ArrowRight size={14} className="text-blue-500" />
                                                        <span className="text-blue-600">{data.meter_akhir}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 md:py-10 px-6 md:px-8 text-right">
                                                <p className="font-black text-lg md:text-xl text-slate-900 tracking-tight">Rp {data.total_bayar.toLocaleString('id-ID')}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Grand Total Area */}
                        <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t-4 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
                            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-[#0A0F2C] rounded-3xl md:rounded-4xl text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group w-full md:w-auto">
                                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                                    <CheckCircle2 size={24} className="md:size-32 text-emerald-400" strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Payment Status</p>
                                    <p className="font-black text-lg md:text-2xl tracking-tighter uppercase">{data.status_bayar}</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right w-full md:w-auto px-4">
                                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3">Amount Paid</p>
                                <div className="relative inline-flex items-baseline justify-center md:justify-end gap-2">
                                    <span className="font-black text-lg md:text-2xl text-slate-300">Rp</span>
                                    <p className="text-5xl md:text-7xl font-black text-[#0A0F2C] tracking-tighter leading-none">
                                        {data.total_bayar.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
iv{">"}

                        {/* Footer Disclaimer */}
                        <div className="mt-auto pt-16 border-t border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs">HF</div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Hydro-Flow Systems</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Secure Billing Document</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-bold text-slate-500 italic max-w-xs leading-relaxed">
                                    This is a computer-generated document. No signature is required. <br />
                                    Verify your billing data at https://hydro-flow.systems/portal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Footer Modal Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                    <button 
                        onClick={onClose}
                        className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors order-2 sm:order-1"
                    >
                        Tutup
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                        <button 
                            onClick={handleDownloadPDF}
                            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Download size={18} /> Simpan PDF
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Printer size={18} /> Cetak Transaksi
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
