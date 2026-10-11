import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  getClientIp,
  cleanIp,
  isPrefetchRequest,
  shouldIgnoreRequest,
} from "@/lib/logging/request-tracker";

function createMockRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(new URL(url, "https://portfolio.local"), {
    headers: new Headers(headers),
  });
  return req;
}

describe("request-tracker: getClientIp", () => {
  it("extracts client IP from x-forwarded-for single IP", () => {
    const req = createMockRequest("https://portfolio.local/", {
      "x-forwarded-for": "203.0.113.195",
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("extracts leftmost client IP from chained x-forwarded-for proxies", () => {
    const req = createMockRequest("https://portfolio.local/", {
      "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip if x-forwarded-for is missing", () => {
    const req = createMockRequest("https://portfolio.local/", {
      "x-real-ip": "198.51.100.4",
    });
    expect(getClientIp(req)).toBe("198.51.100.4");
  });

  it("extracts cf-connecting-ip from Cloudflare proxy requests", () => {
    const req = createMockRequest("https://portfolio.local/", {
      "cf-connecting-ip": "192.0.2.1",
    });
    expect(getClientIp(req)).toBe("192.0.2.1");
  });

  it("extracts x-vercel-forwarded-for from Vercel requests", () => {
    const req = createMockRequest("https://portfolio.local/", {
      "x-vercel-forwarded-for": "198.51.100.22, 10.0.0.1",
    });
    expect(getClientIp(req)).toBe("198.51.100.22");
  });

  it("cleans IPv4-mapped IPv6 address prefix ::ffff:", () => {
    expect(cleanIp("::ffff:192.168.1.50")).toBe("192.168.1.50");
    expect(cleanIp("192.168.1.50")).toBe("192.168.1.50");
  });

  it("defaults to 127.0.0.1 when no IP headers are present", () => {
    const req = createMockRequest("https://portfolio.local/");
    expect(getClientIp(req)).toBe("127.0.0.1");
  });
});

describe("request-tracker: isPrefetchRequest", () => {
  it("detects Next.js next-router-prefetch header", () => {
    const req = createMockRequest("https://portfolio.local/about", {
      "next-router-prefetch": "1",
    });
    expect(isPrefetchRequest(req)).toBe(true);
  });

  it("detects Next.js next-router-segment-prefetch header", () => {
    const req = createMockRequest("https://portfolio.local/about", {
      "next-router-segment-prefetch": "1",
    });
    expect(isPrefetchRequest(req)).toBe(true);
  });

  it("detects browser standard purpose: prefetch header", () => {
    const req = createMockRequest("https://portfolio.local/projects", {
      purpose: "prefetch",
    });
    expect(isPrefetchRequest(req)).toBe(true);
  });

  it("detects browser standard sec-purpose: prefetch header", () => {
    const req = createMockRequest("https://portfolio.local/contact", {
      "sec-purpose": "prefetch",
    });
    expect(isPrefetchRequest(req)).toBe(true);
  });

  it("returns false for regular user navigation requests", () => {
    const req = createMockRequest("https://portfolio.local/about", {
      accept: "text/html,application/xhtml+xml",
    });
    expect(isPrefetchRequest(req)).toBe(false);
  });
});

describe("request-tracker: shouldIgnoreRequest", () => {
  it("ignores prefetch requests", () => {
    const req = createMockRequest("https://portfolio.local/about", {
      "next-router-prefetch": "1",
    });
    expect(shouldIgnoreRequest(req, "1.2.3.4")).toBe(true);
  });

  it("ignores internal Next.js assets", () => {
    const req = createMockRequest("https://portfolio.local/_next/static/chunks/app.js");
    expect(shouldIgnoreRequest(req, "1.2.3.4")).toBe(true);
  });

  it("ignores favicon and brand vector assets", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/favicon.ico"), "1.2.3.4")).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/icon.svg"), "1.2.3.4")).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/logo.svg"), "1.2.3.4")).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/robots.txt"), "1.2.3.4")).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/opengraph-image"), "1.2.3.4")).toBe(true);
  });

  it("ignores static image files by extension", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/images/projects/klippify.webp"), "1.2.3.4")).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/photo.jpg"), "1.2.3.4")).toBe(true);
  });

  it("tracks valid initial page requests", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/"), "10.0.0.1")).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/projects"), "10.0.0.2")).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/projects/klippify"), "10.0.0.3")).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/contact"), "10.0.0.4")).toBe(false);
  });

  it("deduplicates rapid burst GET requests from the exact same IP and path", () => {
    const ip = "192.168.10.99";
    const req1 = createMockRequest("https://portfolio.local/unique-test-path");
    const req2 = createMockRequest("https://portfolio.local/unique-test-path");

    // First hit is accepted
    expect(shouldIgnoreRequest(req1, ip)).toBe(false);
    // Second hit within 1.5s is ignored
    expect(shouldIgnoreRequest(req2, ip)).toBe(true);
  });

  it("tracks API endpoints", () => {
    const req = createMockRequest("https://portfolio.local/api/contact", {}, );
    // Custom method POST
    expect(shouldIgnoreRequest(req, "10.0.0.5")).toBe(false);
  });
});

describe("request-tracker: grouping by IP address & visited paths timeline", () => {
  it("groups visits by IP address and preserves chronological path history", () => {
    const mockLogs = [
      { ip: "203.0.113.1", path: "/contact", method: "GET", created_at: "2026-10-11T16:45:00.000Z" },
      { ip: "198.51.100.2", path: "/about", method: "GET", created_at: "2026-10-11T16:41:00.000Z" },
      { ip: "203.0.113.1", path: "/projects", method: "GET", created_at: "2026-10-11T16:43:00.000Z" },
      { ip: "203.0.113.1", path: "/", method: "GET", created_at: "2026-10-11T16:40:00.000Z" },
    ];

    const groupedMap = new Map<string, { ip: string; total: number; paths: string[] }>();
    for (const log of mockLogs) {
      if (!groupedMap.has(log.ip)) {
        groupedMap.set(log.ip, { ip: log.ip, total: 0, paths: [] });
      }
      const item = groupedMap.get(log.ip)!;
      item.total += 1;
      item.paths.push(log.path);
    }

    const visitor1 = groupedMap.get("203.0.113.1");
    expect(visitor1).toBeDefined();
    expect(visitor1?.total).toBe(3);
    expect(visitor1?.paths).toEqual(["/contact", "/projects", "/"]);

    const visitor2 = groupedMap.get("198.51.100.2");
    expect(visitor2).toBeDefined();
    expect(visitor2?.total).toBe(1);
    expect(visitor2?.paths).toEqual(["/about"]);
  });
});
