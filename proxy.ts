import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET });
  const isAdmin = token?.role === "admin";
  if (request.nextUrl.pathname.startsWith("/api/admin/") && !isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) return NextResponse.redirect(new URL("/login", request.url));
  if (request.nextUrl.pathname === "/login" && isAdmin) return NextResponse.redirect(new URL("/admin", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/login"] };
