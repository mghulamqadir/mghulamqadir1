import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

/** Authenticate cookie-based API mutations without redirecting API consumers. */
export async function requireAdminApi(request: Request) {
  const session = await getAdminSession();
  if (!session) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return { response: NextResponse.json({ error: "Invalid request origin" }, { status: 403 }) } as const;
    } catch {
      return { response: NextResponse.json({ error: "Invalid request origin" }, { status: 403 }) } as const;
    }
  }
  return { user: session.user } as const;
}
