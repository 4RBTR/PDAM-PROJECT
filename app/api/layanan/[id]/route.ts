// app/api/layanan/[id]/route.ts - PUT /api/layanan/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const updated = await prisma.layanan.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json({ status: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: "Gagal update status" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.layanan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ status: true, message: "Layanan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: "Gagal menghapus layanan" }, { status: 500 });
  }
}
