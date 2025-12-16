import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json("Missing fields", { status: 400 });
    }

    /* 1️⃣ SUPER ADMIN */
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email },
    });

    if (superAdmin) {
      const match = await bcrypt.compare(password, superAdmin.password);
      if (!match) {
        return NextResponse.json("Invalid credentials", { status: 401 });
      }

      const token = jwt.sign(
        { id: superAdmin.id, role: "SUPER_ADMIN" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({ role: "SUPER_ADMIN" });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    /* 2️⃣ SCHOOL ADMIN */
    const school = await prisma.school.findUnique({
      where: { email },
    });

    if (school) {
      const match = await bcrypt.compare(password, school.password);
      if (!match) {
        return NextResponse.json("Invalid credentials", { status: 401 });
      }

      const token = jwt.sign(
        { id: school.id, role: "SCHOOL_ADMIN" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({ role: "SCHOOL_ADMIN" });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    /* 3️⃣ FACULTY / PARENT */
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json("Invalid credentials", { status: 401 });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          schoolId: user.schoolId,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({ role: user.role });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    return NextResponse.json("User not found", { status: 404 });
  } catch (error) {
    return NextResponse.json("Server error", { status: 500 });
  }
}
