import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, createdById } = await req.json();

    if (!name || !email || !password || !createdById) {
      return NextResponse.json("Missing fields", { status: 400 });
    }

    const exists = await prisma.school.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json("School already exists", { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const school = await prisma.school.create({
      data: {
        name,
        email,
        password: hashed,
        createdById,
      },
    });

    return NextResponse.json(
      { message: "School created", school },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json("Server error", { status: 500 });
  }
}
