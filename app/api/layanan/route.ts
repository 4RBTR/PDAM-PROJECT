// app/api/layanan/route.ts - GET, POST /api/layanan
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    let items;
    if (role === "PELANGGAN" && userId) {
      items = await prisma.layanan.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Kasir/Manager see all
      items = await prisma.layanan.findMany({
        include: { user: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ status: true, data: items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, jenis, deskripsi } = await req.json();

    const newItem = await prisma.layanan.create({
      data: {
        userId: parseInt(userId),
        jenis,
        deskripsi,
        status: "PENDING",
      },
    });

    return NextResponse.json({ status: true, data: newItem });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: "Gagal membuat layanan" }, { status: 500 });
  }
}
