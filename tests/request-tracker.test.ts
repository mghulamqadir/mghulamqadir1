import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  getClientIp,
  cleanIp,
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

describe("request-tracker: shouldIgnoreRequest", () => {
  it("ignores internal Next.js assets", () => {
    const req = createMockRequest("https://portfolio.local/_next/static/chunks/app.js");
    expect(shouldIgnoreRequest(req)).toBe(true);
  });

  it("ignores favicon and brand vector assets", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/favicon.ico"))).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/icon.svg"))).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/logo.svg"))).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/robots.txt"))).toBe(true);
  });

  it("ignores static image files by extension", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/images/projects/klippify.webp"))).toBe(true);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/photo.jpg"))).toBe(true);
  });

  it("tracks valid page requests", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/"))).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/projects"))).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/projects/klippify"))).toBe(false);
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/contact"))).toBe(false);
  });

  it("tracks API endpoints", () => {
    expect(shouldIgnoreRequest(createMockRequest("https://portfolio.local/api/contact"))).toBe(false);
  });
});
