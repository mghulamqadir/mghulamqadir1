import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { trackRequest } from "@/lib/logging/request-tracker";

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // 1. Asynchronously track request without delaying client response
  event.waitUntil(trackRequest(request));

  // 2. Authentication and authorization check for admin routes
  const pathname = request.nextUrl.pathname;
  const requiresAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin/") ||
    pathname === "/login";

  if (requiresAuth) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET,
    });
    const isAdmin = token?.role === "admin";

    if (pathname.startsWith("/api/admin/") && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname === "/login" && isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
