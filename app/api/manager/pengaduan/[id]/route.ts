// app/api/manager/pengaduan/[id]/route.ts - PUT, DELETE /api/manager/pengaduan/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, tanggapan } = await req.json();
    await prisma.pengaduan.update({
      where: { id: parseInt(id) },
      data: { status, tanggapan },
    });
    return NextResponse.json({
      status: true,
      message: "Status & Tanggapan diperbarui",
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Gagal update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pengaduan.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({
      status: true,
      message: "Pesan berhasil dihapus permanen",
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Gagal menghapus pesan" },
      { status: 500 }
    );
  }
}
