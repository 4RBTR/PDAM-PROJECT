'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AboutPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-700 overflow-x-hidden flex flex-col relative">

            {/* --- BACKGROUND DECORATION (Sama seperti Home) --- */}
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
                        <Link href="/about" className="text-sky-600 font-bold transition-colors py-2">Tentang</Link>
                        <Link href="/services" className="hover:text-sky-600 transition-colors py-2">Layanan</Link>
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
                        <Link href="/about" className="text-lg font-medium text-sky-600 py-2 border-b border-slate-50">Tentang Kami</Link>
                        <Link href="/services" className="text-lg font-medium text-slate-600 py-2 border-b border-slate-50">Layanan</Link>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link href="/login" className="w-full text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl">Masuk</Link>
                            <Link href="/register" className="w-full text-center py-3 font-bold text-white bg-sky-600 rounded-xl shadow-lg shadow-sky-200">Daftar Sekarang</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- CONTENT AREA --- */}
            <main className="pt-32 pb-20 md:pt-40 container mx-auto px-6 relative z-10 max-w-5xl">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
                        Tentang <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-700">Kami</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
                        Membangun ekosistem layanan air bersih yang transparan, efisien, dan mudah diakses oleh seluruh lapisan masyarakat Indonesia.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-12">

                    {/* Intro Card */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10"></div>
                        <p className="text-slate-600 text-lg leading-loose">
                            <strong className="text-slate-900 font-bold">PDAM Pintar</strong> adalah inisiatif digitalisasi layanan air bersih yang bertujuan untuk mempermudah masyarakat dalam mengakses kebutuhan air bersih yang transparan, cepat, dan akuntabel. Kami percaya bahwa teknologi dapat menjembatani kesenjangan antara penyedia layanan dan pelanggan.
                        </p>
                    </div>

                    {/* Visi Misi Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Visi */}
                        <div className="bg-linear-to-br from-white to-sky-50 p-8 rounded-3xl border border-sky-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-2xl mb-6">👁️</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi Kami</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Menjadi penyedia layanan air bersih berbasis teknologi terdepan yang menjamin ketersediaan air bagi seluruh lapisan masyarakat dengan standar kualitas internasional.
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-6">🚀</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi Kami</h3>
                            <ul className="space-y-3">
                                {[
                                    "Digitalisasi penuh sistem pembayaran tagihan.",
                                    "Transparansi pemakaian air secara real-time.",
                                    "Respon cepat dan tiket prioritas untuk keluhan.",
                                    "Edukasi penghematan air berkelanjutan."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden relative">
                        {/* Decorative background for this card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex-1 relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Komitmen Inovasi</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Sejak didirikan, kami berkomitmen untuk terus berinovasi. Sistem ini dibangun untuk menghilangkan antrian loket, mengurangi penggunaan kertas (paperless), dan memberikan kendali penuh kepada pelanggan.
                            </p>
                        </div>
                        <div className="shrink-0 relative z-10">
                            <Link href="/register" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-sky-50 transition">Bergabung Sekarang</Link>
                        </div>
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
                                <li><Link href="/about" className="text-sky-400 transition block">Tentang Kami</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Hubungi Kami</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3"><span>📍</span> <span>Jakarta, Indonesia</span></li>
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