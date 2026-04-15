"use client"

import { MapPin, CheckCircle2 } from "lucide-react"

interface ProfileCardProps {
    greeting: string;
    name: string;
    address: string;
    userId: string;
}

export default function ProfileCard({ greeting, name, address, userId }: ProfileCardProps) {
    return (
        <>
            {/* MOBILE HERO */}
            <div className="lg:hidden bg-[#0A0F2C] rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-row items-center justify-between gap-4">
                <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-blue-400/80 text-[8px] font-black uppercase tracking-[0.2em] mb-1">{greeting}</p>
                    <h2 className="text-xl font-black text-white truncate leading-tight uppercase font-heading">{name.split(' ')[0] || "User"}</h2>
                    <div className="flex items-center gap-2 text-blue-200/40 text-[9px] font-bold mt-1">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">{address || "Alamat..."}</span>
                    </div>
                </div>
                <div className="relative z-10 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-center">
                    <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-0.5">ID PELANGGAN</p>
                    <p className="text-lg font-mono font-black text-white tracking-widest leading-none">
                        <span className="text-blue-500 text-sm mr-0.5">#</span>{String(userId || '').padStart(5, '0')}
                    </p>
                </div>
            </div>

            {/* DESKTOP HERO */}
            <div className="hidden lg:flex bg-[#0A0F2C] rounded-[2.5rem] p-12 shadow-2xl shadow-blue-900/10 relative overflow-hidden flex-row justify-between items-center gap-8 print:shadow-none print:border print:bg-none print:text-black">
                <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-br from-blue-600/30 to-indigo-600/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10 text-white w-full md:w-auto">
                    <p className="text-blue-200/60 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                        {greeting} 👋
                    </p>
                    <h2 className="text-6xl font-black capitalize mb-8 tracking-tighter leading-none">{name || "Pelanggan"}</h2>
                    
                    <div className="flex flex-wrap gap-4">
                        <div className="inline-flex items-center gap-3 text-xs bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-inner group/addr">
                            <MapPin size={14} className="text-blue-400 shrink-0" />
                            <span className="font-bold text-blue-50 max-w-[200px] truncate">{address || "Memuat alamat..."}</span>
                        </div>
                        <div className="inline-flex items-center gap-3 text-xs bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-inner group/role">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span className="font-bold text-emerald-50">Pelanggan Aktif</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 w-[280px] bg-white/5 backdrop-blur-md p-8 rounded-4xl border border-white/10">
                    <div className="flex flex-col items-end justify-center">
                        <p className="text-[11px] font-black text-blue-300/80 uppercase tracking-[0.2em] mb-3">ID Pelanggan</p>
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-blue-400 font-black text-2xl">#</span>
                            <p className="text-5xl font-mono font-black tracking-[0.15em] leading-none">{String(userId || '').padStart(5, '0')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
