import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  // 1️⃣ Read token from cookie
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  // 2️⃣ Verify token
  const decoded = jwt.verify(token, JWT_SECRET) as {
    id: string;
    role: string;
  };

  // 3️⃣ Role check
  if (decoded.role !== "SUPER_ADMIN") {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  // 4️⃣ Fetch ONLY logged-in admin
  const admin = await prisma.superAdmin.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return NextResponse.json(admin);
}
