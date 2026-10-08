import type { NextRequest } from "next/server";
import { recordRequestLog } from "@/lib/repositories/request-logs";

const IGNORED_EXTENSIONS = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|eot)$/i;

const IGNORED_PATHS = new Set([
  "/favicon.ico",
  "/icon.svg",
  "/logo.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
]);

/**
 * Resolves the client IP address from request headers, accounting for proxies,
 * CDNs (Vercel, Cloudflare), and local environments.
 */
export function getClientIp(request: NextRequest): string {
  // 1. Check x-forwarded-for header (left-most IP is the original client)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return cleanIp(firstIp);
  }

  // 2. Check direct provider headers
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return cleanIp(realIp.trim());

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cleanIp(cfConnectingIp.trim());

  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const firstIp = vercelForwardedFor.split(",")[0]?.trim();
    if (firstIp) return cleanIp(firstIp);
  }

  // 3. Fallback to runtime ip property if present
  const directIp = (request as unknown as { ip?: string }).ip;
  if (directIp) return cleanIp(directIp);

  // 4. Default fallback for local development
  return "127.0.0.1";
}

/**
 * Normalizes IP addresses (strips IPv6 IPv4-mapped prefix ::ffff:).
 */
export function cleanIp(rawIp: string): string {
  if (rawIp.startsWith("::ffff:")) {
    return rawIp.slice(7);
  }
  return rawIp;
}

/**
 * Determines whether a path is a static asset or internal probe that should not be logged.
 */
export function shouldIgnoreRequest(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;

  // Ignore Next.js internal assets
  if (pathname.startsWith("/_next/")) return true;

  // Ignore static assets by exact match
  if (IGNORED_PATHS.has(pathname)) return true;

  // Ignore static assets by file extension
  if (IGNORED_EXTENSIONS.test(pathname)) return true;

  return false;
}

/**
 * Captures request metadata and persists it asynchronously in MongoDB request_logs.
 */
export async function trackRequest(request: NextRequest): Promise<void> {
  if (shouldIgnoreRequest(request)) return;

  const ip = getClientIp(request);
  const path = request.nextUrl.pathname;
  const method = request.method;
  const query = request.nextUrl.search || null;
  const user_agent = request.headers.get("user-agent") || null;
  const referer = request.headers.get("referer") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;
  const city = request.headers.get("x-vercel-ip-city") || null;
  const region = request.headers.get("x-vercel-ip-country-region") || null;

  await recordRequestLog({
    ip,
    method,
    path,
    query,
    user_agent,
    referer,
    country,
    city,
    region,
  });
}
