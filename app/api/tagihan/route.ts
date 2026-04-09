// app/api/tagihan/route.ts - POST /api/tagihan (Kasir: input tagihan baru)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, bulan, tahun, meter_awal, meter_akhir } = await req.json();

    const cek = await prisma.tagihan.findFirst({
      where: {
        userId: parseInt(userId),
        bulan: bulan,
        tahun: parseInt(tahun),
      },
    });
    if (cek)
      return NextResponse.json(
        { status: false, message: "Tagihan bulan ini sudah ada!" },
        { status: 400 }
      );

    const total = (parseInt(meter_akhir) - parseInt(meter_awal)) * 5000;
    const data = await prisma.tagihan.create({
      data: {
        userId: parseInt(userId),
        bulan,
        tahun: parseInt(tahun),
        meter_awal: parseInt(meter_awal),
        meter_akhir: parseInt(meter_akhir),
        total_bayar: total,
        status_bayar: "BELUM_BAYAR",
      },
    });
    return NextResponse.json({ status: true, message: "Sukses", data });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
