"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Droplets, Receipt, User, Phone } from "lucide-react"
import SidebarManager from "@/components/Manager/SidebarManager"
import { getAuthToken } from "@/utils/cookies"
import toast from "react-hot-toast"

interface Transaction {
    id: string | number
    bulan: string
    tahun: string
    meter_awal: number
    meter_akhir: number
    total_bayar: number
    status_bayar: 'LUNAS' | 'BELUM LUNAS'
}

interface Customer {
    id: number
    name: string
    email: string
    phone: string | null
    address: string | null
    profile_picture: string | null
}

export default function DetailRiwayatPelanggan() {
    const { id } = useParams()
    const router = useRouter()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [managerName, setManagerName] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManagerData = async () => {
            const token = getAuthToken()
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${localStorage.getItem("userId")}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.status) setManagerName(data.data.name)
            } catch (e) { console.error(e) }
        }
        fetchManagerData()
        fetchDetail()
    }, [id])

    const fetchDetail = async () => {
        try {
            const token = getAuthToken()
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/users/${id}/history`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.status) {
                setTransactions(data.transactions)
                setCustomer(data.user)
            }
        } catch (error) {
            toast.error("Gagal memuat riwayat")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Memuat...</div>

    return (
        <div className="flex min-h-screen bg-[#F4F7FE] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <SidebarManager 
                isOpen={false} 
                onClose={() => {}} 
                onLogout={() => {}} 
            />
            
            <main className="flex-1 p-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ChevronLeft size={20} /> Kembali ke Daftar
                </button>

                {/* Profil Singkat Pelanggan */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-blue-600"></div>
                    
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl shrink-0">
                        {customer?.profile_picture ? (
                            <img src={customer.profile_picture.startsWith('http') ? customer.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${customer.profile_picture}`} alt={customer.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-4xl">
                                {customer?.name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{customer?.name}</h1>
                            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">Aktif</span>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-medium mb-4">{customer?.email}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Phone size={14} className="text-indigo-500" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{customer?.phone || "No HP Kosong"}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Receipt className="text-amber-500" size={14} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Customer ID: #{id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:border-l border-slate-100 dark:border-slate-800 md:pl-8 flex flex-col gap-2 w-full md:w-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Alamat Terdaftar</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-xs leading-relaxed italic">
                            &quot;{customer?.address || "Alamat belum diatur oleh pelanggan"}&quot;
                        </p>
                    </div>
                </div>

                {/* Tabel Riwayat */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Log Transaksi Air</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/80">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Periode</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Meter</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {transactions.map((t: Transaction) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{t.bulan} {t.tahun}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.meter_awal} - {t.meter_akhir} m³</td>
                                    <td className="px-6 py-4 font-bold">Rp {t.total_bayar.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                            t.status_bayar === 'LUNAS' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-rose-900/40 dark:text-rose-400'
                                        }`}>
                                            {t.status_bayar}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}