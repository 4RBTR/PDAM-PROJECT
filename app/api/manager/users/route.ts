// app/api/manager/users/route.ts - GET /api/manager/users
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.user.findMany({
      where: { role: "PELANGGAN" },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ status: true, data });
  } catch {
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data pelanggan" },
      { status: 500 }
    );
  }
}
