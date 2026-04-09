// app/api/contact/route.ts - POST /api/contact (Kontak tamu)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { nama, email, pesan } = await req.json();
    if (!nama || !email || !pesan) {
      return NextResponse.json(
        { status: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const data = await prisma.pengaduan.create({
      data: {
        userId: null,
        nama,
        email,
        judul: `Pesan Tamu: ${nama}`,
        deskripsi: pesan,
        status: "PENDING",
        isRead: false,
        isDeletedByUser: false,
      },
    });

    return NextResponse.json({
      status: true,
      message: "Pesan tamu berhasil disimpan",
      data,
    });
  } catch (error) {
    console.error("Error Contact:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
