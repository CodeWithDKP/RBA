import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name ,email, password } = body;
    if (!name || !email || !password) {
      return  NextResponse.json ("Missing required fields", { status: 400 });
    }
    const isExist= await prisma.superAdmin.findUnique({
        where:{email}
    })
    if(isExist){
      return  NextResponse.json ("Already existed", { status: 401 });
    }
   const hashed = await bcrypt.hash(password,10)
  const newSuperAdmin = await prisma.superAdmin.create({
    data: {
      name,
      email,
      password: hashed,
    }
  });

  return NextResponse.json(
    { message: "Super admin registered successfully", superAdmin: { id: newSuperAdmin.id, name: newSuperAdmin.name, email: newSuperAdmin.email } },
    { status: 201 }
  );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}