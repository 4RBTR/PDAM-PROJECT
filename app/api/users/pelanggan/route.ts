// app/api/users/pelanggan/route.ts - GET /api/users/pelanggan
// Optimized: select only needed fields (no password hash)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.user.findMany({
      where: { role: "PELANGGAN" },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        profile_picture: true,
      },
    });
    return NextResponse.json({ status: true, data });
  } catch {
    return NextResponse.json({ status: false }, { status: 500 });
  }
}
