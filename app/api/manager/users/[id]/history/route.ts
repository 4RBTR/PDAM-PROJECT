// app/api/manager/users/[id]/history/route.ts - GET /api/manager/users/[id]/history
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { name: true, email: true, address: true },
    });

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const transactions = await prisma.tagihan.findMany({
      where: { userId: parseInt(id) },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ status: true, user, transactions });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: String(error) },
      { status: 500 }
    );
  }
}
