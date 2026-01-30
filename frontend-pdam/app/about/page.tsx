'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Efek untuk mendeteksi scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        // Hapus 'h-screen' fix, gunakan min-h-screen agar bisa discroll jika konten panjang
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 flex flex-col relative">

            {/* --- BACKGROUND DECORATION --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[40px_40px] opacity-60"></div>
                <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-sky-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-100 h-100 bg-indigo-50/60 rounded-full blur-[100px]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <div className="fixed top-0 left-0 right-0 z-100 flex justify-center p-4 md:p-6 pointer-events-none">
                <nav className={`
                    w-full max-w-6xl pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    rounded-[22px] border relative group/nav
                    ${isMobileMenuOpen || scrolled
                        ? 'bg-white border-slate-200 shadow-2xl'
                        : 'bg-white/60 backdrop-blur-md border-white/40 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:bg-white/80 hover:border-white/60'}
                `}>
                    <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent"></div>
                    <div className="px-5 md:px-8 h-14 md:h-17 flex justify-between items-center relative z-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group/logo">
                            <div className="relative w-9 h-9 flex items-center justify-center">
                                <div className="absolute inset-0 bg-slate-900 rounded-xl transition-all duration-500 group-hover/logo:rotate-10 group-hover/logo:bg-indigo-600 group-hover/logo:shadow-[0_0_20px_rgba(79,70,229,0.4)]"></div>
                                <span className="relative z-10 text-white font-black text-lg">P</span>
                            </div>
                            <div className="hidden sm:flex flex-col gap-0">
                                <span className="font-bold text-lg tracking-tight text-slate-900 leading-tight">PDAM<span className="text-indigo-600">.</span></span>
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] -mt-0.5">Pintar AI</span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-2">
                            {['About', 'Services', 'Contact'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className={`px-4 py-2 text-[13px] font-bold rounded-full transition-all duration-300 relative group/item ${item === 'About' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                                    <span className="relative z-10">{item}</span>
                                    <span className="absolute inset-0 bg-slate-900/5 rounded-full scale-50 opacity-0 group-hover/item:scale-100 group-hover/item:opacity-100 transition-all duration-300"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 md:gap-5">
                            <Link href="/login" className="hidden md:block text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Masuk</Link>
                            <Link href="/register" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[13px] font-bold shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-indigo-500/40 hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">Get Started</Link>
                            <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-100/50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 rotate-45 translate-y-1' : 'w-5'}`}></div>
                                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 -rotate-45 -translate-y-1' : 'w-3 self-end mr-2.5'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'max-h-100 border-t border-slate-100 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
                        <div className="p-6 space-y-1">
                            {['About', 'Services', 'Contact'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className="flex items-center p-3 text-base font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">{item}</Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-slate-50">
                                <Link href="/login" className="block w-full py-4 text-center font-bold text-slate-900 rounded-xl hover:bg-slate-50 transition">Masuk ke Akun</Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            {/* Added mb-20 to ensure content pushes footer down properly even on large screens */}
            <main className="grow pt-32 pb-24 md:pt-44 container mx-auto px-6 relative z-10 max-w-5xl">

                {/* Hero Section */}
                <div className="text-center mb-20 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">Our Story</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tighter leading-[0.95]">
                        Revolusi Air <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-indigo-600 to-slate-900">Digital.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                        Mengubah cara Indonesia mengelola sumber daya vital melalui kecerdasan buatan dan transparansi total.
                    </p>
                </div>

                <div className="space-y-8 md:space-y-12">
                    {/* Introduction Card */}
                    <div className="bg-white p-8 md:p-12 rounded-4xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-75 h-75 bg-linear-to-bl from-indigo-50/80 to-transparent rounded-bl-[100px] transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="relative z-10 md:w-3/4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Siapa Kami?</h2>
                            <p className="text-slate-600 text-lg leading-loose">
                                <strong className="text-indigo-600">PDAM Pintar AI</strong> bukan sekadar aplikasi pembayaran. Kami adalah ekosistem teknologi yang menjembatani kesenjangan antara penyedia layanan air dan masyarakat.
                            </p>
                        </div>
                    </div>

                    {/* Visi & Misi */}
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-slate-900 p-10 rounded-4xl text-white flex flex-col justify-between group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
                            <div>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 transition-colors duration-300">👁️</div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">Visi Besar</h3>
                                <p className="text-slate-400 leading-relaxed">Menjadi standar emas pelayanan publik digital di Asia Tenggara.</p>
                            </div>
                            <div className="mt-8 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-1/3 group-hover:w-full transition-all duration-700 ease-out"></div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-4xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🚀</div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Misi Kami</h3>
                            <ul className="space-y-4">
                                {["Transparansi data real-time.", "Penghapusan antrian fisik.", "Respon AI < 5 menit.", "Edukasi konservasi air."].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="relative rounded-4xl overflow-hidden bg-indigo-600 text-white p-8 md:p-16 text-center">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Bergabung dengan Revolusi Ini</h3>
                            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Jangan biarkan pengelolaan air Anda ketinggalan zaman.</p>
                            <Link href="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm tracking-wide hover:scale-105 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300">
                                DAFTAR SEKARANG
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-950 pt-24 pb-10 text-slate-400 border-t border-slate-900 relative z-20 mt-auto">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                        {/* Brand */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-10 h-10 bg-linear-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-900/50">P</div>
                                <span className="font-bold text-2xl tracking-tight">PDAM Pintar</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
                                Platform digitalisasi layanan air bersih terdepan di Indonesia. Memudahkan akses air bersih untuk semua.
                            </p>
                            <div className="flex gap-4 pt-2">
                                {[1, 2, 3].map(i => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all duration-300">
                                        <span className="text-[10px] font-bold">SOC</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Menu */}
                        <div>
                            <h4 className="text-white font-bold mb-8 text-lg">Menu Utama</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link href="/" className="hover:text-indigo-400 transition flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-indigo-500 transition-colors"></span> Beranda</Link></li>
                                <li><Link href="/about" className="hover:text-indigo-400 transition flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-indigo-500 transition-colors"></span> Tentang Kami</Link></li>
                                <li><Link href="/services" className="hover:text-indigo-400 transition flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-indigo-500 transition-colors"></span> Layanan</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-bold mb-8 text-lg">Hubungi Kami</h4>
                            <ul className="space-y-6 text-sm">
                                <li className="flex items-start gap-4">
                                    <span className="mt-1 p-2 bg-slate-900 rounded-lg text-slate-200">📍</span>
                                    <span className="leading-relaxed">Gedung PDAM Tower Lt. 12<br />Jakarta Selatan, Indonesia</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="p-2 bg-slate-900 rounded-lg text-slate-200">📧</span>
                                    <span className="hover:text-white cursor-pointer transition">support@pdampintar.id</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="p-2 bg-slate-900 rounded-lg text-slate-200">📞</span>
                                    <span className="hover:text-white cursor-pointer transition">+62 21 5555 0000</span>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-bold mb-8 text-lg">Legal</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link href="/privacy" className="hover:text-indigo-400 transition block">Kebijakan Privasi</Link></li>
                                <li><Link href="/terms" className="hover:text-indigo-400 transition block">Syarat & Ketentuan</Link></li>
                                <li><Link href="/faq" className="hover:text-indigo-400 transition block">FAQ</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-600">
                        <p>&copy; {new Date().getFullYear()} PDAM Pintar System. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-indigo-400 transition">Privacy</a>
                            <a href="#" className="hover:text-indigo-400 transition">Terms</a>
                            <a href="#" className="hover:text-indigo-400 transition">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}