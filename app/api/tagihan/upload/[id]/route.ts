// app/api/tagihan/upload/[id]/route.ts - POST /api/tagihan/upload/[id]
// Upload bukti bayar ke Supabase Storage
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToStorage } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { status: false, message: "File gambar wajib diisi" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `bukti-${Date.now()}.${ext}`;

    // Upload ke Supabase Storage
    const publicUrl = await uploadToStorage(file, fileName, "bukti-bayar");

    // Update database dengan URL Supabase (bukan nama file lokal)
    await prisma.tagihan.update({
      where: { id: parseInt(id) },
      data: {
        status_bayar: "MENUNGGU_VERIFIKASI",
        bukti_bayar: publicUrl,
      },
    });

    return NextResponse.json({ status: true, message: "Bukti terkirim" });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
