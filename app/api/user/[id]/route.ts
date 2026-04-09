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
      select: { name: true, email: true, address: true, role: true },
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
    const { name, email, address, password } = await req.json();

    const updateData: Record<string, unknown> = { name, email, address };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      status: true,
      message: "Data pelanggan berhasil diubah!",
      data: updatedUser,
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Gagal mengubah data pelanggan. Email mungkin sudah dipakai.",
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
