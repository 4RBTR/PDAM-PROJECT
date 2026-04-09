// app/api/user/route.ts - POST /api/user (Register)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, address, role } = await req.json();
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashPassword, address, role: role || "PELANGGAN" },
    });
    return NextResponse.json({ status: true, message: "User Berhasil Dibuat" });
  } catch {
    return NextResponse.json(
      { status: false, message: "Email sudah dipakai" },
      { status: 400 }
    );
  }
}
