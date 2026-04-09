// app/api/manager/dashboard/route.ts - GET /api/manager/dashboard
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tagihan = await prisma.tagihan.findMany({
      include: { user: true },
      orderBy: { id: "desc" },
    });

    const totalPelanggan = await prisma.user.count({
      where: { role: "PELANGGAN" },
    });
    const unreadCount = await prisma.pengaduan.count({
      where: { isRead: false },
    });

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
