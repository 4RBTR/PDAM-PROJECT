// app/api/manager/dashboard/route.ts - GET /api/manager/dashboard
// Optimized: Parallel queries + selective fields
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Run ALL queries in parallel instead of sequential (3x faster)
    const [tagihan, totalPelanggan, unreadCount] = await Promise.all([
      prisma.tagihan.findMany({
        select: {
          id: true,
          bulan: true,
          tahun: true,
          meter_awal: true,
          meter_akhir: true,
          total_bayar: true,
          status_bayar: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              address: true,
            },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.user.count({
        where: { role: "PELANGGAN" },
      }),
      prisma.pengaduan.count({
        where: { isRead: false },
      }),
    ]);

    let pendapatan = 0;
    let belumBayar = 0;
    let sudahLunas = 0;
    let totalAir = 0;

    tagihan.forEach((t) => {
      const debit = t.meter_akhir - t.meter_awal;
      totalAir += debit;

      if (t.status_bayar === "LUNAS") {
        pendapatan += t.total_bayar;
        sudahLunas++;
      } else {
        belumBayar++;
      }
    });

    return NextResponse.json({
      status: true,
      stats: {
        total_pendapatan: pendapatan,
        total_pelanggan: totalPelanggan,
        transaksi_lunas: sudahLunas,
        transaksi_tunggakan: belumBayar,
        total_air: totalAir,
        unread_pengaduan: unreadCount,
      },
      data: tagihan,
    });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
