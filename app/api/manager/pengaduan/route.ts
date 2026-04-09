// app/api/manager/pengaduan/route.ts - GET /api/manager/pengaduan
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.pengaduan.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    // Mark as read
    await prisma.pengaduan.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ status: true, data: list });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Gagal ambil data" },
      { status: 500 }
    );
  }
}
