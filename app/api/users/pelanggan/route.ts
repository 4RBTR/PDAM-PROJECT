// app/api/users/pelanggan/route.ts - GET /api/users/pelanggan
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.user.findMany({ where: { role: "PELANGGAN" } });
    return NextResponse.json({ status: true, data });
  } catch {
    return NextResponse.json({ status: false }, { status: 500 });
  }
}
