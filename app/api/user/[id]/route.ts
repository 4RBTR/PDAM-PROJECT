// app/api/user/[id]/route.ts - GET, PUT, DELETE /api/user/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, address: true, role: true, phone: true, profile_picture: true },
    });
    return NextResponse.json({ status: true, data: user });
  } catch {
    return NextResponse.json({ status: false }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, address, password, phone, profile_picture } = await req.json();

    const updateData: Record<string, unknown> = { name, email, address, phone, profile_picture };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      status: true,
      message: "Data user berhasil diubah!",
      data: updatedUser,
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error("DEBUG: Update Profile Error:", err);
    
    let message = "Gagal mengubah data user.";
    if (err.code === "P2002") {
      message = "Email sudah digunakan oleh akun lain.";
    }

    return NextResponse.json(
      {
        status: false,
        message: message,
        error: process.env.NODE_ENV === "development" ? err.message : undefined
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ status: true, message: "Pelanggan berhasil dihapus!" });
  } catch {
    return NextResponse.json(
      {
        status: false,
        message:
          "Gagal menghapus! Pastikan pelanggan ini tidak memiliki tagihan atau pengaduan.",
      },
      { status: 500 }
    );
  }
}
