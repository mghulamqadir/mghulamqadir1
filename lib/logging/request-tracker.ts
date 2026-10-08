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
  "/opengraph-image",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
]);

// In-memory cache for debouncing rapid duplicate hits (e.g. browser duplicate probes, HMR reloads)
const recentGetRequests = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1500; // 1.5 seconds

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
 * Detects whether an incoming request is an automated background prefetch request
 * dispatched by Next.js <Link> components or the browser prefetch engine.
 */
export function isPrefetchRequest(request: NextRequest): boolean {
  // Next.js Link prefetch headers
  if (request.headers.has("next-router-prefetch")) return true;
  if (request.headers.has("next-router-segment-prefetch")) return true;
  if (request.headers.get("x-middleware-prefetch") === "1") return true;

  // Browser standard prefetch headers
  const purpose = request.headers.get("purpose")?.toLowerCase();
  if (purpose === "prefetch") return true;

  const secPurpose = request.headers.get("sec-purpose")?.toLowerCase();
  if (secPurpose === "prefetch") return true;

  const xPurpose = request.headers.get("x-purpose")?.toLowerCase();
  if (xPurpose === "prefetch") return true;

  return false;
}

/**
 * Filters out duplicate rapid GET requests from the exact same IP and path
 * within a short burst window (1.5s).
 */
export function isDuplicateRapidRequest(ip: string, path: string): boolean {
  const key = `${ip}:${path}`;
  const now = Date.now();
  const lastTime = recentGetRequests.get(key);

  // Prune map periodically to prevent unbounded memory growth
  if (recentGetRequests.size > 2000) {
    for (const [k, timestamp] of recentGetRequests.entries()) {
      if (now - timestamp > DEDUPE_WINDOW_MS * 2) {
        recentGetRequests.delete(k);
      }
    }
  }

  if (lastTime && now - lastTime < DEDUPE_WINDOW_MS) {
    return true;
  }

  recentGetRequests.set(key, now);
  return false;
}

/**
 * Determines whether a request is a static asset, metadata route, prefetch probe,
 * or rapid burst duplicate that should not be logged.
 */
export function shouldIgnoreRequest(request: NextRequest, ip: string): boolean {
  // 1. Ignore automated Next.js Link prefetch requests
  if (isPrefetchRequest(request)) return true;

  const pathname = request.nextUrl.pathname;

  // 2. Ignore Next.js internal assets
  if (pathname.startsWith("/_next/")) return true;

  // 3. Ignore dynamic metadata and icon routes
  if (pathname.startsWith("/opengraph-image")) return true;
  if (pathname.startsWith("/apple-touch-icon")) return true;
  if (pathname.startsWith("/apple-icon")) return true;
  if (pathname.startsWith("/icon.")) return true;

  // 4. Ignore static assets by exact match
  if (IGNORED_PATHS.has(pathname)) return true;

  // 5. Ignore static assets by file extension
  if (IGNORED_EXTENSIONS.test(pathname)) return true;

  // 6. Deduplicate rapid burst GET requests (e.g. browser duplicate probes, HMR refreshes)
  if (request.method === "GET" || request.method === "HEAD") {
    if (isDuplicateRapidRequest(ip, pathname)) {
      return true;
    }
  }

  return false;
}

/**
 * Captures request metadata and persists it asynchronously in MongoDB request_logs.
 */
export async function trackRequest(request: NextRequest): Promise<void> {
  const ip = getClientIp(request);

  if (shouldIgnoreRequest(request, ip)) return;

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
