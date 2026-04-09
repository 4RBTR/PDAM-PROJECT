// app/api/pengaduan/user/[id]/route.ts - GET /api/pengaduan/user/[id] (Riwayat pengaduan user)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const list = await prisma.pengaduan.findMany({
      where: {
        userId: parseInt(id),
        isDeletedByUser: false,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ status: true, data: list });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Gagal ambil data" },
      { status: 500 }
    );
  }
}
