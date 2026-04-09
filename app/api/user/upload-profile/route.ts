// app/api/user/upload-profile/route.ts - POST /api/user/upload-profile
import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
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
    const fileName = `profile-${Date.now()}.${ext}`;

    // Upload ke Supabase Storage (bucket "Pdam", folder "profiles")
    const publicUrl = await uploadToStorage(file, fileName, "profiles");

    return NextResponse.json({ 
      status: true, 
      message: "Foto profil berhasil diupload",
      data: { url: publicUrl }
    });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: String(err) },
      { status: 500 }
    );
  }
}
