"use client"
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0A192F] text-white font-sans selection:bg-sky-500 selection:text-white pb-20">

            {/* Simple Navbar */}
            <nav className="border-b border-white/5 bg-[#0A192F]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <span className="bg-sky-500 w-8 h-8 rounded flex items-center justify-center">P</span> PDAM Pintar
                    </Link>
                    <Link href="/" className="text-sm text-slate-400 hover:text-white">Kembali ke Beranda</Link>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                    Tentang Kami
                </h1>

                <div className="space-y-8 text-slate-300 leading-relaxed text-lg">
                    <p>
                        <strong className="text-white">PDAM Pintar</strong> adalah inisiatif digitalisasi layanan air bersih yang bertujuan untuk mempermudah masyarakat dalam mengakses kebutuhan air bersih yang transparan, cepat, dan akuntabel.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-12">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-4">Visi Kami</h3>
                            <p>Menjadi penyedia layanan air bersih berbasis teknologi terdepan yang menjamin ketersediaan air bagi seluruh lapisan masyarakat.</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-4">Misi Kami</h3>
                            <ul className="list-disc ml-5 space-y-2">
                                <li>Digitalisasi pembayaran tagihan.</li>
                                <li>Transparansi pemakaian air.</li>
                                <li>Respon cepat terhadap keluhan pelanggan.</li>
                            </ul>
                        </div>
                    </div>

                    <p>
                        Sejak didirikan, kami berkomitmen untuk terus berinovasi. Sistem ini dibangun untuk menghilangkan antrian loket, mengurangi penggunaan kertas (paperless), dan memberikan kendali penuh kepada pelanggan melalui dashboard pribadi mereka.
                    </p>
                </div>
            </main>
        </div>
    )
}