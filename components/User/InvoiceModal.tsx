"use client"

import React, { useRef } from "react"
import { X, Download, Droplets, CheckCircle2, ArrowRight, Printer, Clock, AlertCircle } from "lucide-react"
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

    const usage = data.meter_akhir - data.meter_awal
    const isPaid = data.status_bayar === "LUNAS"
    const documentType = isPaid ? "Invoice" : "Tagihan"
    const documentTitle = isPaid ? "Invoice Digital" : "Rincian Tagihan"
    const documentNumber = isPaid ? `INV-${String(data.id).padStart(6, '0')}` : `BILL-${String(data.id).padStart(6, '0')}`
    const memberId = `#${String(user.id).padStart(5, '0')}`

    // Download PDF — uses html2canvas-pro (supports oklch) + jsPDF
    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return

        const loadingToast = toast.loading("Menyiapkan berkas PDF...")
        try {
            const html2canvas = (await import("html2canvas-pro")).default
            const { default: jsPDF } = await import("jspdf")

            const element = invoiceRef.current
            const canvas = await html2canvas(element, {
                scale: 3,
                logging: false,
                useCORS: true,
                backgroundColor: "#ffffff",
            })

            const imgData = canvas.toDataURL("image/png", 1.0)
            const cardWidth = 100 // mm
            const cardHeight = (canvas.height * cardWidth) / canvas.width

            const pdf = new jsPDF({
                orientation: cardHeight > cardWidth ? "portrait" : "landscape",
                unit: "mm",
                format: [cardWidth + 10, cardHeight + 10]
            })

            pdf.addImage(imgData, "PNG", 5, 5, cardWidth, cardHeight, undefined, 'FAST')
            pdf.save(`${documentType}_HydroFlow_${data.bulan}_${data.tahun}_${user.name.replace(/\s+/g, '_')}.pdf`)

            toast.success("PDF berhasil diunduh!", { id: loadingToast })
        } catch (error) {
            console.error("PDF Export Error:", error)
            toast.error("Gagal mengunduh PDF.", { id: loadingToast })
        }
    }

    // Print — uses system print dialog (connects to real printer via USB/WiFi)
    const handlePrint = () => {
        if (!invoiceRef.current) return

        const printContent = invoiceRef.current.innerHTML
        const printWindow = window.open('', '_blank', 'width=420,height=600')
        if (!printWindow) {
            toast.error("Pop-up diblokir. Izinkan pop-up untuk mencetak.")
            return
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${documentTitle} ${documentNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        display: flex; justify-content: center; align-items: flex-start;
                        min-height: 100vh; background: #fff; padding: 20px;
                    }
                    .invoice-card {
                        width: 360px; background: #fff; border-radius: 24px;
                        overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                    }
                    @media print {
                        body { padding: 0; }
                        .invoice-card { box-shadow: none; border: 1px solid #e2e8f0; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-card">${printContent}</div>
                <script>
                    window.onload = function() {
                        setTimeout(function() { window.print(); }, 300);
                        window.onafterprint = function() { window.close(); };
                    };
                <\/script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{documentTitle}</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isPaid ? "text-emerald-600" : data.status_bayar === "MENUNGGU_VERIFIKASI" ? "text-amber-600" : "text-rose-600"}`}>{data.status_bayar.replace('_', ' ')}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Invoice Card */}
                <div className="flex-1 overflow-auto p-5 bg-slate-100/50 dark:bg-slate-950/50 scrollbar-hide">
                    <div
                        ref={invoiceRef}
                        id="printable-invoice"
                        className="mx-auto max-w-[360px] overflow-hidden"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '24px' }}
                    >
                        {/* Top gradient bar */}
                        <div style={{ height: '8px', background: 'linear-gradient(90deg, #0A0F2C 0%, #3B82F6 50%, #6366F1 100%)' }}></div>

                        {/* Header Row */}
                        <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#0A0F2C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Droplets size={20} color="#60A5FA" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 900, fontSize: '14px', color: '#0f172a', lineHeight: 1 }}>Hydro-Flow</p>
                                    <p style={{ fontSize: '8px', fontWeight: 900, color: '#2563EB', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '2px' }}>Systems</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{documentType}</p>
                                <p style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{documentNumber}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ margin: '0 24px', height: '1px', backgroundColor: '#F1F5F9' }}></div>

                        {/* Customer Info */}
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Pelanggan</p>
                                <p style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a', lineHeight: 1.2 }}>{user.name}</p>
                                <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address}</p>
                            </div>
                            <div style={{ padding: '8px 12px', borderRadius: '12px', backgroundColor: '#EEF2FF', textAlign: 'center' }}>
                                <p style={{ fontSize: '7px', fontWeight: 900, color: '#4F46E5', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Member ID</p>
                                <p style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{memberId}</p>
                            </div>
                        </div>

                        {/* Period & Date */}
                        <div style={{ margin: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 0' }}>
                            <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: '#F8FAFC' }}>
                                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Periode</p>
                                <p style={{ fontWeight: 900, fontSize: '14px', color: '#0f172a' }}>{data.bulan} {data.tahun}</p>
                            </div>
                            <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: '#F8FAFC' }}>
                                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Tanggal Cetak</p>
                                <p style={{ fontWeight: 900, fontSize: '14px', color: '#0f172a' }}>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Meter Reading */}
                        <div style={{ margin: '12px 24px', padding: '16px', borderRadius: '16px', backgroundColor: '#F8FAFC' }}>
                            <p style={{ fontSize: '8px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Pembacaan Meter</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '8px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>AWAL</p>
                                    <p style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: 900, color: '#64748B' }}>{data.meter_awal}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '1px', backgroundColor: '#CBD5E1' }}></div>
                                    <ArrowRight size={14} color="#3B82F6" />
                                    <div style={{ width: '32px', height: '1px', backgroundColor: '#CBD5E1' }}></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '8px', fontWeight: 700, color: '#2563EB', marginBottom: '4px' }}>AKHIR</p>
                                    <p style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: 900, color: '#2563EB' }}>{data.meter_akhir}</p>
                                </div>
                                <div style={{ marginLeft: '8px', padding: '6px 12px', borderRadius: '12px', backgroundColor: '#EEF2FF' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 900, color: '#4F46E5' }}>{usage} m³</p>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ margin: '12px 24px', padding: '20px', borderRadius: '16px', backgroundColor: '#0A0F2C', color: '#ffffff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '8px', fontWeight: 900, color: '#93C5FD', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Total Tagihan</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8' }}>Rp</span>
                                        <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.02em' }}>{data.total_bayar.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '12px', backgroundColor: isPaid ? 'rgba(52,211,153,0.15)' : data.status_bayar === 'MENUNGGU_VERIFIKASI' ? 'rgba(251,191,36,0.15)' : 'rgba(244,63,94,0.15)' }}>
                                    {isPaid ? <CheckCircle2 size={16} color="#34D399" strokeWidth={3} /> : data.status_bayar === 'MENUNGGU_VERIFIKASI' ? <Clock size={16} color="#FBBF24" strokeWidth={3} /> : <AlertCircle size={16} color="#F43F5E" strokeWidth={3} />}
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: isPaid ? "#34D399" : data.status_bayar === 'MENUNGGU_VERIFIKASI' ? "#FBBF24" : "#F43F5E", textTransform: 'uppercase' }}>{data.status_bayar.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 900, color: '#94A3B8' }}>HF</div>
                                <p style={{ fontSize: '8px', fontWeight: 700, color: '#94A3B8' }}>Hydro-FlowSystems</p>
                            </div>
                            <p style={{ fontSize: '7px', fontWeight: 700, color: '#94A3B8', fontStyle: 'italic' }}>E-Receipt • Auto Generated</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
                    >
                        Tutup
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Printer size={16} /> Cetak
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> PDF
                    </button>
                </div>
            </div>
        </div>
    )
}
