'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  return (
    // WRAPPER UTAMA
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden flex flex-col relative antialiased">

      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid Pattern yang lebih tajam */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[50px_50px] opacity-[0.3]"></div>

        {/* Soft Radial Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-200 h-200 bg-sky-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-200 h-200 bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>

      {/* --- THE OBSIDIAN GLASS NAVBAR --- */}
      <div className="fixed top-0 left-0 right-0 z-100 flex justify-center p-4 md:p-6 pointer-events-none">
        <nav
          className={`
            w-full max-w-6xl pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            rounded-[22px] border relative group/nav
            ${isMobileMenuOpen
              ? 'bg-white border-slate-200 shadow-2xl'
              : 'bg-white/50 backdrop-blur-md border-white/30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:bg-white/70 hover:border-white/50'}
          `}
        >
          {/* Top subtle highlight line */}
          <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent"></div>

          <div className="px-5 md:px-8 h-14 md:h-17 flex justify-between items-center relative z-10">

            {/* Logo Section - Minimalist yet Bold */}
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

            {/* Desktop Menu - Invisible Pill Style */}
            <div className="hidden md:flex items-center gap-2">
              {['About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="px-4 py-2 text-[13px] font-bold text-slate-500 hover:text-indigo-600 rounded-full transition-all duration-300 relative group/item"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute inset-0 bg-slate-900/5 rounded-full scale-50 opacity-0 group-hover/item:scale-100 group-hover/item:opacity-100 transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side - Premium CTAs */}
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

              {/* Mobile Menu Toggle - Sleek Minimalist */}
              <button
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-100/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 rotate-45 translate-y-1' : 'w-5'}`}></div>
                <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 -rotate-45 -translate-y-1' : 'w-3 self-end mr-2.5'}`}></div>
              </button>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
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
      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 md:px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left Column: Text */}
        <div className="flex-1 w-full text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-100 text-sky-700 text-[11px] font-bold uppercase tracking-wider shadow-[0_2px_10px_rgba(14,165,233,0.15)] mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Sistem Pembayaran Pintar V2.0
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Bayar Air <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500">Tanpa Antri.</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Sistem monitoring dan pembayaran PDAM modern. Cek tagihan real-time, bayar instan via QRIS, dan laporkan gangguan dalam satu aplikasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Link href="/register" className="group px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
              Mulai Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center">
              Lihat Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-5 text-sm text-slate-500 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-md ring-1 ring-slate-100 bg-[url('https://i.pravatar.cc/100?img=${i + 15}')] bg-cover`}></div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-md ring-1 ring-slate-100">+2k</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-0.5 text-amber-400 mb-0.5 text-sm">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-xs font-semibold text-slate-600">Pelanggan Puas di <span className="text-sky-600">12 Kota</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Mockup (Lebih 3D & Modern) */}
        <div className="flex-1 w-full max-w-100 md:max-w-xl perspective-1000 lg:mt-0 relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          {/* Dekorasi Belakang Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-linear-to-tr from-sky-300/20 via-indigo-300/20 to-violet-300/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

          <div className="relative group">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white/60 p-2 transform transition-all duration-700 hover:scale-[1.02]">

              {/* Inner Bezel */}
              <div className="bg-slate-50 rounded-4xl overflow-hidden border border-slate-100/50">

                {/* Browser/App Header */}
                <div className="bg-white border-b border-slate-100 p-5 flex gap-3 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dashboard</span>
                    <span className="text-sm font-bold text-slate-800">Halo, Budi Santoso 👋</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover"></div>
                </div>

                {/* Mockup Body */}
                <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
                  {/* Saldo Section (Glass Dark) */}
                  <div className="group/card bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden transition-all hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover/card:bg-indigo-500/30 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Tagihan</div>
                        <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">Bulan Ini</div>
                      </div>
                      <div className="text-3xl font-bold tracking-tight mb-1">Rp 124.500</div>
                      <div className="text-slate-400 text-xs mb-6">Jatuh tempo: 20 Agustus 2024</div>

                      <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all active:scale-95">Bayar Sekarang</button>
                    </div>
                  </div>

                  {/* Icon Cards (Grid) */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { i: '💧', t: 'Meteran', c: 'bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-100' },
                      { i: '📜', t: 'Riwayat', c: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100' },
                      { i: '🎧', t: 'Bantuan', c: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100' },
                    ].map((m, idx) => (
                      <div key={idx} className={`bg-white p-3 rounded-2xl shadow-sm border ${m.c} border-opacity-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-1`}>
                        <span className="text-xl">{m.i}</span>
                        <span className="text-[10px] font-bold">{m.t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fake Chart */}
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xs font-bold text-slate-700">Statistik Pemakaian</div>
                      <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Hemmat 5%</div>
                    </div>
                    <div className="flex items-end gap-2 h-24 justify-between px-2">
                      {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                        <div key={i} className="w-full flex flex-col justify-end group/bar h-full">
                          <div className="w-full bg-slate-100 rounded-t-md group-hover/bar:bg-indigo-500 transition-all duration-300 relative" style={{ height: `${h}%` }}>
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-all transform translate-y-2 group-hover/bar:translate-y-0 shadow-xl pointer-events-none">
                              {h}m³
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- STATS SECTION --- */}
      <section className="bg-slate-900 py-20 -skew-y-2 relative z-20 -mx-10 md:mx-0 overflow-hidden border-y-[6px] border-slate-800 shadow-2xl">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-slate-950/80"></div>

        <div className="container mx-auto px-6 skew-y-2 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x-0 md:divide-x divide-slate-800/50">
            {[
              { l: "Pelanggan Aktif", v: "15,000+", c: "from-sky-300 to-sky-500" },
              { l: "Transaksi/Bulan", v: "50rb+", c: "from-indigo-300 to-indigo-500" },
              { l: "Kota Terjangkau", v: "12 Kota", c: "from-emerald-300 to-emerald-500" },
              { l: "Rating App", v: "4.9/5", c: "from-amber-300 to-amber-500" }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default p-4">
                <h3 className={`text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-linear-to-b ${s.c} group-hover:scale-110 transition-transform duration-300 ease-out`}>{s.v}</h3>
                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">Kenapa Memilih Kami?</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Fitur Lengkap untuk <span className="underline decoration-indigo-400/30 decoration-4 underline-offset-4">Kenyamanan</span> Anda</h2>
            <p className="text-slate-500 text-lg">Teknologi terbaik untuk kenyamanan Anda dalam mengakses air bersih, didesain untuk kemudahan maksimal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { t: "Real-time Monitoring", d: "Pantau penggunaan air harian dari HP Anda secara akurat tanpa perlu menunggu tagihan akhir bulan.", i: "📊", c: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" },
              { t: "Pembayaran Instan", d: "Dukung QRIS, Virtual Account Bank & E-Wallet. Konfirmasi otomatis dalam hitungan detik.", i: "💳", c: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" },
              { t: "Layanan Pengaduan", d: "Lapor kebocoran atau gangguan air dengan tiket prioritas dan tracking status pengerjaan.", i: "🛠️", c: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" },
            ].map((f, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-4xl border border-slate-100 hover:border-transparent hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${f.c} flex items-center justify-center text-3xl mb-8 shadow-sm transition-colors duration-300`}>{f.i}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{f.t}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm group-hover:text-slate-600">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-16 md:py-24 bg-slate-50 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-violet-600 rounded-[2.5rem] p-10 md:p-24 text-center text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group">

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 group-hover:translate-x-1/4 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/30 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 group-hover:-translate-x-1/4 transition-transform duration-1000"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Siap Beralih ke Digital? <br /> <span className="text-indigo-200">Mulai langkah Anda hari ini.</span></h2>
              <p className="text-indigo-100 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pelanggan lainnya yang sudah merasakan kemudahan pembayaran online dan monitoring mandiri.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto pt-4">
                <Link href="/register" className="bg-white text-indigo-700 px-10 py-4 rounded-full font-bold hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/20 w-full sm:w-auto hover:-translate-y-1 hover:shadow-xl active:scale-95">
                  Buat Akun Gratis
                </Link>
                <Link href="/contact" className="bg-indigo-800/40 backdrop-blur-sm text-white border border-white/20 px-10 py-4 rounded-full font-bold hover:bg-indigo-900/60 transition w-full sm:w-auto active:scale-95">
                  Hubungi Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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