// app/api/pengaduan/[id]/route.ts - DELETE /api/pengaduan/[id] (Soft delete pengaduan)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pengaduan.update({
      where: { id: parseInt(id) },
      data: { isDeletedByUser: true },
    });
    return NextResponse.json({
      status: true,
      message: "Laporan berhasil dihapus dari riwayat",
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Gagal menghapus laporan" },
      { status: 500 }
    );
  }
}
