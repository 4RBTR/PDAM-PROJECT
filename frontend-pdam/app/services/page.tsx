'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Data services dengan tambahan properti warna (colorClass) agar lebih cantik
    const services = [
        {
            icon: "💧",
            title: "Penyaluran Air Bersih",
            desc: "Jaminan kualitas air bersih sesuai standar kesehatan yang mengalir 24 jam ke rumah Anda.",
            colorClass: "bg-blue-100 text-blue-600"
        },
        {
            icon: "💳",
            title: "Pembayaran Online",
            desc: "Bayar tagihan air kapan saja dan di mana saja melalui dashboard pelanggan yang terintegrasi (QRIS & VA).",
            colorClass: "bg-green-100 text-green-600"
        },
        {
            icon: "🔧",
            title: "Pemasangan Baru",
            desc: "Proses pengajuan sambungan baru yang lebih cepat dengan pelacakan status secara real-time.",
            colorClass: "bg-orange-100 text-orange-600"
        },
        {
            icon: "📊",
            title: "Monitoring Meteran",
            desc: "Catat dan pantau penggunaan air bulanan Anda secara akurat dan transparan lewat aplikasi.",
            colorClass: "bg-purple-100 text-purple-600"
        },
        {
            icon: "🚑",
            title: "Layanan Darurat",
            desc: "Tim reaksi cepat untuk penanganan kebocoran pipa utama atau gangguan distribusi air di wilayah Anda.",
            colorClass: "bg-red-100 text-red-600"
        },
        {
            icon: "📱",
            title: "Aplikasi Mobile",
            desc: "Akses semua layanan dalam genggaman. Cek tagihan, lapor meteran, dan aduan dalam satu aplikasi.",
            colorClass: "bg-sky-100 text-sky-600"
        },
    ]

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-700 overflow-x-hidden flex flex-col relative">

            {/* --- BACKGROUND DECORATION (Konsisten) --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[32px_32px]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-75 md:w-150 h-75 md:h-150 bg-sky-100/60 rounded-full blur-[80px] md:blur-[120px] opacity-70"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-75 md:w-150 h-75 md:h-150 bg-indigo-50/60 rounded-full blur-[80px] md:blur-[120px] opacity-70"></div>
            </div>

            {/* --- NAVBAR (Konsisten) --- */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
                <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2.5 z-50">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 text-white font-bold text-lg">P</div>
                        <span className="font-bold text-lg md:text-xl tracking-tight text-slate-800">PDAM <span className="text-sky-600">Pintar</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
                        <Link href="/" className="hover:text-sky-600 transition-colors py-2">Beranda</Link>
                        <Link href="/about" className="hover:text-sky-600 transition-colors py-2">Tentang</Link>
                        <Link href="/services" className="text-sky-600 font-bold transition-colors py-2">Layanan</Link>
                        <Link href="/contact" className="hover:text-sky-600 transition-colors py-2">Kontak</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="text-slate-600 font-medium hover:text-sky-600 transition px-4 py-2 text-sm">Masuk</Link>
                        <Link href="/register" className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5">Daftar Gratis</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5 duration-200">
                        <Link href="/" className="text-lg font-medium text-slate-600 py-2 border-b border-slate-50">Beranda</Link>
                        <Link href="/about" className="text-lg font-medium text-slate-600 py-2 border-b border-slate-50">Tentang Kami</Link>
                        <Link href="/services" className="text-lg font-medium text-sky-600 py-2 border-b border-slate-50">Layanan</Link>
                        <Link href="/contact" className="text-lg font-medium text-slate-600 py-2 border-b border-slate-50">Kontak</Link>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link href="/login" className="w-full text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl">Masuk</Link>
                            <Link href="/register" className="w-full text-center py-3 font-bold text-white bg-sky-600 rounded-xl shadow-lg shadow-sky-200">Daftar Sekarang</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- CONTENT AREA --- */}
            <main className="pt-32 pb-20 md:pt-40 container mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
                        Layanan <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-700">Unggulan</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        Kami hadir memberikan solusi air bersih dengan dukungan teknologi modern. Nikmati kemudahan akses layanan PDAM kapanpun dan dimanapun.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {services.map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            {/* Icon Box */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 ${item.colorClass} transition-transform group-hover:scale-110 duration-300`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call to Action Mini */}
                <div className="mt-20 text-center bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Belum menemukan yang Anda cari?</h2>
                    <p className="text-slate-500 mb-8">Tim kami siap membantu menjawab pertanyaan spesifik mengenai instalasi dan tagihan Anda.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contact" className="bg-white border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-sm">
                            Hubungi Kami
                        </Link>
                        <Link href="/register" className="bg-sky-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-sky-700 transition shadow-lg shadow-sky-200">
                            Daftar Akun
                        </Link>
                    </div>
                </div>

            </main>

            {/* --- FOOTER (Konsisten) --- */}
            <footer className="bg-slate-900 pt-16 pb-8 text-slate-400 border-t border-slate-800 relative z-20 mt-auto">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center font-bold">P</div>
                                <span className="font-bold text-xl">PDAM Pintar</span>
                            </div>
                            <p className="text-sm leading-relaxed">Platform digitalisasi layanan air bersih terdepan.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Menu Utama</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/" className="hover:text-sky-400 transition block">Beranda</Link></li>
                                <li><Link href="/about" className="hover:text-sky-400 transition block">Tentang Kami</Link></li>
                                <li><Link href="/services" className="text-sky-400 transition block">Layanan</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Hubungi Kami</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3"><span>📍</span> <span>Malang, Jawa Timur</span></li>
                                <li className="flex items-center gap-3"><span>📧</span> <span>support@pdampintar.id</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/privacy" className="hover:text-sky-400 transition block">Privasi</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col items-center gap-4 text-xs text-center">
                        <p>&copy; {new Date().getFullYear()} PDAM Pintar System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}