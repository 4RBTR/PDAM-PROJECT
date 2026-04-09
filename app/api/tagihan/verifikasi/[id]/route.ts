// app/api/tagihan/verifikasi/[id]/route.ts - PUT /api/tagihan/verifikasi/[id] (Kasir: eksekusi verifikasi)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { aksi } = await req.json();
    const status = aksi === "TERIMA" ? "LUNAS" : "BELUM_BAYAR";
    const updateData =
      aksi === "TERIMA"
        ? { status_bayar: status }
        : { status_bayar: status, bukti_bayar: null };

    await prisma.tagihan.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      status: true,
      message: aksi === "TERIMA" ? "Lunas" : "Ditolak",
    });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
