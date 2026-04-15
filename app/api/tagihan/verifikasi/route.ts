// app/api/tagihan/verifikasi/route.ts - GET /api/tagihan/verifikasi (Kasir: list verifikasi)
// Optimized: select only needed fields
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.tagihan.findMany({
      where: { status_bayar: "MENUNGGU_VERIFIKASI" },
      select: {
        id: true,
        bulan: true,
        tahun: true,
        total_bayar: true,
        bukti_bayar: true,
        user: {
          select: { name: true },
        },
      },
    });

    const formatted = data.map((item) => ({
      id: item.id,
      userName: item.user.name,
      bulan: item.bulan,
      tahun: item.tahun,
      total_bayar: item.total_bayar,
      bukti_bayar: item.bukti_bayar,
    }));

    return NextResponse.json({ status: true, data: formatted });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
