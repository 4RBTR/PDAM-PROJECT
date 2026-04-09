// app/api/pengaduan/route.ts - POST /api/pengaduan (User: kirim pengaduan dengan foto)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToStorage } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string | null;
    const nama = formData.get("nama") as string | null;
    const email = formData.get("email") as string | null;
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const imageFile = formData.get("image") as File | null;

    const userIdInt =
      user_id && user_id !== "undefined" && user_id !== "null"
        ? parseInt(user_id)
        : null;

    let fotoUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const fileName = `pengaduan-${Date.now()}.${ext}`;
      fotoUrl = await uploadToStorage(imageFile, fileName, "pengaduan");
    }

    const data = await prisma.pengaduan.create({
      data: {
        userId: userIdInt,
        nama: userIdInt ? undefined : (nama ?? undefined),
        email: userIdInt ? undefined : (email ?? undefined),
        judul,
        deskripsi,
        foto: fotoUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      status: true,
      message: "Pengaduan terkirim!",
      data,
    });
  } catch (error) {
    console.error("Error Pengaduan:", error);
    return NextResponse.json(
      { status: false, message: "Gagal kirim pengaduan" },
      { status: 500 }
    );
  }
}
