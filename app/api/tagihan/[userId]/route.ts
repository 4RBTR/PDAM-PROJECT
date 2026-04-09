// app/api/tagihan/[userId]/route.ts - GET /api/tagihan/[userId] (Pelanggan: lihat tagihan)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const data = await prisma.tagihan.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ status: true, data });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
