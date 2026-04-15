"use client"

import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts'
import { Activity } from "lucide-react"

interface ChartDataPoint {
    name: string;
    year: number;
    monthNum: number;
    aktual: number;
}

interface RevenueChartProps {
    data: ChartDataPoint[];
    formatRp: (n: number) => string;
}

export default function RevenueChart({ data, formatRp }: RevenueChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-80 w-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Activity className="text-slate-300 dark:text-slate-600 mb-3" size={32} />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada riwayat transaksi lunas untuk ditampilkan di grafik.</p>
            </div>
        )
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAktual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
                        tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`}
                    />
                    <Tooltip
                        cursor={{ stroke: '#6366F1', strokeWidth: 2, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '16px' }}
                        itemStyle={{ fontWeight: 'bold', fontSize: '14px' }}
                        formatter={(value: number | undefined) => [formatRp(value ?? 0), "Aktual"]}
                        labelStyle={{ color: '#64748B', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="aktual"
                        stroke="#6366F1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorAktual)"
                        activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff', fill: '#6366F1', className: 'drop-shadow-md' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
