'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Efek scroll untuk navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Data services diperbarui dengan styling icon yang lebih konsisten
    const services = [
        {
            icon: "💧",
            title: "Penyaluran Air Bersih",
            desc: "Jaminan kualitas air bersih sesuai standar kesehatan WHO yang mengalir 24 jam ke rumah Anda tanpa henti.",
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            icon: "💳",
            title: "Pembayaran Digital",
            desc: "Bayar tagihan air kapan saja melalui dashboard pelanggan yang terintegrasi (QRIS, VA, E-Wallet).",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            icon: "🔧",
            title: "Instalasi Cepat",
            desc: "Proses pengajuan sambungan baru yang dipangkas menjadi 3x lebih cepat dengan pelacakan status real-time.",
            color: "bg-orange-50 text-orange-600 border-orange-100"
        },
        {
            icon: "📊",
            title: "Smart Monitoring",
            desc: "Catat dan pantau penggunaan air bulanan Anda secara akurat dan transparan lewat fitur Smart Meter.",
            color: "bg-violet-50 text-violet-600 border-violet-100"
        },
        {
            icon: "🚑",
            title: "Unit Reaksi Cepat",
            desc: "Tim teknis 24/7 siap meluncur untuk penanganan kebocoran pipa utama atau gangguan distribusi mendesak.",
            color: "bg-rose-50 text-rose-600 border-rose-100"
        },
        {
            icon: "📱",
            title: "Super App Mobile",
            desc: "Akses semua layanan dalam genggaman. Cek tagihan, lapor meteran mandiri, dan pengaduan dalam satu aplikasi.",
            color: "bg-sky-50 text-sky-600 border-sky-100"
        },
    ]

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 flex flex-col relative overflow-x-hidden">

            {/* --- BACKGROUND DECORATION (Sama dengan About) --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[40px_40px] opacity-60"></div>
                <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-indigo-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-100 h-100 bg-sky-50/60 rounded-full blur-[100px]"></div>
            </div>

            {/* --- NAVBAR (Sama dengan About) --- */}
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
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className={`px-4 py-2 text-[13px] font-bold rounded-full transition-all duration-300 relative group/item ${item === 'Services' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                                >
                                    <span className="relative z-10">{item}</span>
                                    <span className="absolute inset-0 bg-slate-900/5 rounded-full scale-50 opacity-0 group-hover/item:scale-100 group-hover/item:opacity-100 transition-all duration-300"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 md:gap-5">
                            <Link href="/login" className="hidden md:block text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[13px] font-bold shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-indigo-500/40 hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                            >
                                Get Started
                            </Link>
                            {/* Mobile Toggle */}
                            <button
                                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-100/50"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 rotate-45 translate-y-1' : 'w-5'}`}></div>
                                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 -rotate-45 -translate-y-1' : 'w-3 self-end mr-2.5'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <div className={`
                        md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${isMobileMenuOpen ? 'max-h-100 border-t border-slate-100 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}
                    `}>
                        <div className="p-6 space-y-1">
                            {['About', 'Services', 'Contact'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className="flex items-center p-3 text-base font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                                    {item}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-slate-50">
                                <Link href="/login" className="block w-full py-4 text-center font-bold text-slate-900 rounded-xl hover:bg-slate-50 transition">Masuk ke Akun</Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="grow pt-32 pb-24 md:pt-44 container mx-auto px-6 relative z-10 max-w-6xl">

                {/* Hero Title */}
                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">Our Solutions</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tighter leading-tight">
                        Layanan Cerdas untuk<br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-indigo-600 to-slate-900">Kebutuhan Air Anda.</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                        Kami mengintegrasikan infrastruktur fisik dengan teknologi digital untuk memberikan pengalaman pelanggan yang mulus dan transparan.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
                    {services.map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)] hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group">

                            {/* Icon Wrapper */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 border ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 text-sm leading-loose">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA / Help Section */}
                <div className="relative rounded-4xl overflow-hidden bg-slate-900 text-white p-8 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-200">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-75 h-75 bg-indigo-600/20 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 max-w-lg">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Butuh Bantuan Khusus?</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Tim teknis kami siap membantu permasalahan instalasi pipa atau kendala tagihan Anda 24/7.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <Link href="/contact" className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                            Hubungi Support
                        </Link>
                        <Link href="/register" className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all">
                            Buat Akun
                        </Link>
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