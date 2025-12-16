import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect dashboard routes
    if (!pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    // No token → login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;

        // ROLE-BASED ACCESS
        if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (pathname.startsWith("/dashboard/school") && role !== "SCHOOL_ADMIN") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (pathname.startsWith("/dashboard/faculty") && role !== "FACULTY") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (pathname.startsWith("/dashboard/parent") && role !== "PARENT") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    } catch {
        // Invalid / expired token
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
