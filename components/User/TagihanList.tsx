"use client"

import { Eye, CreditCard } from "lucide-react"
import { useState } from "react"

interface ITagihan {
    id: number;
    bulan: string;
    tahun: number;
    meter_awal: number;
    meter_akhir: number;
    total_bayar: number;
    status_bayar: string;
    bukti_bayar: string | null;
}

interface TagihanListProps {
    tagihan: ITagihan[];
    loading: boolean;
    onUpload: (id: number, file: File) => void;
    onViewInvoice: (t: ITagihan) => void;
}

// Skeleton
const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-pulse mb-6">
        <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-10 flex-1 flex flex-col justify-center">
                <div className="flex gap-4 mb-8">
                    <div className="bg-slate-100 dark:bg-slate-800 h-8 w-32 rounded-xl"></div>
                    <div className="bg-slate-100 dark:bg-slate-800 h-8 w-24 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 h-4 w-20 rounded"></div>
                    <div className="bg-slate-100 dark:bg-slate-800 h-12 w-64 rounded-2xl"></div>
                </div>
            </div>
            <div className="p-8 lg:w-96 bg-slate-50/50 dark:bg-slate-800/20 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
            </div>
        </div>
    </div>
)

export default function TagihanList({ tagihan, loading, onUpload, onViewInvoice }: TagihanListProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadingId, setUploadingId] = useState<number | null>(null)

    const handleUploadClick = (id: number) => {
        if (!selectedFile) return
        onUpload(id, selectedFile)
        setUploadingId(null)
        setSelectedFile(null)
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        )
    }

    if (tagihan.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">Belum Ada Tagihan</h4>
            </div>
        )
    }

    return (
        <div className="space-y-4 md:space-y-8">
            {tagihan.map((t) => (
                <div key={t.id} className="group overflow-hidden rounded-3xl md:rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl dark:hover:border-blue-500/30">
                    <div className="flex flex-col lg:flex-row">
                        {/* LEFT: Info */}
                        <div className="flex-1 p-5 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase tracking-widest">{t.bulan} {t.tahun}</div>
                                <div className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5
                                    ${t.status_bayar === "LUNAS" ? "bg-emerald-50 text-emerald-600" : t.status_bayar === "BELUM_BAYAR" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}
                                `}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${t.status_bayar === "LUNAS" ? "bg-emerald-600" : t.status_bayar === "BELUM_BAYAR" ? "bg-rose-600" : "bg-amber-600"}`}></div>
                                    {t.status_bayar}
                                </div>
                            </div>

                            <div className="flex flex-row items-end justify-between md:justify-start md:gap-16">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Total Tagihan</p>
                                    <h4 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Rp {t.total_bayar.toLocaleString('id-ID')}</h4>
                                </div>
                                <div className="hidden sm:block opacity-60">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meter</p>
                                    <p className="text-xs font-bold">{t.meter_akhir - t.meter_awal} m³</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Action */}
                        <div className="p-5 md:p-10 md:w-80 bg-slate-50/50 dark:bg-slate-800/20 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex items-center print:hidden">
                            {t.status_bayar === "LUNAS" ? (
                                <button onClick={() => onViewInvoice(t)} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all">
                                    <Eye size={16} /> Lihat Invoce
                                </button>
                            ) : t.status_bayar === "MENUNGGU_VERIFIKASI" ? (
                                <div className="w-full text-center text-[11px] font-black text-amber-600/70 uppercase tracking-widest italic">
                                    Sedang Diverifikasi
                                </div>
                            ) : (
                                <div className="w-full space-y-3">
                                    {uploadingId === t.id ? (
                                        <div className="space-y-3">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 dark:file:bg-slate-800 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-900 cursor-pointer transition-colors"
                                            />
                                            {selectedFile && (
                                                <p className="text-[10px] text-emerald-600 font-bold truncate">✓ {selectedFile.name}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <button onClick={() => { setUploadingId(null); setSelectedFile(null); }} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
                                                <button onClick={() => handleUploadClick(t.id)} className="flex-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase transition-colors">Kirim Bukti</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setUploadingId(t.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                                            <CreditCard size={18} /> Bayar Tagihan
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
