import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, parseDurationSeconds, resolveSiteUrl } from "@/lib/env";

describe("environment parsing", () => {
  it("parses seconds", () => expect(parseDurationSeconds("30s")).toBe(30));
  it("parses hours", () => expect(parseDurationSeconds("8h")).toBe(28_800));
  it("parses days", () => expect(parseDurationSeconds("7d")).toBe(604_800));

  it("prefers the explicitly configured site URL", () => {
    expect(resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://configured.example",
      VERCEL_PROJECT_PRODUCTION_URL: "generated.vercel.app",
    })).toBe("https://configured.example");
  });

  it("uses Vercel's production URL when the explicit URL is absent", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "generated.vercel.app" }))
      .toBe("https://generated.vercel.app");
  });

  it("uses the deployment URL for preview builds", () => {
    expect(resolveSiteUrl({ VERCEL_URL: "preview-123.vercel.app" }))
      .toBe("https://preview-123.vercel.app");
  });

  it("uses the canonical portfolio URL when deployment URLs are unavailable", () => {
    expect(resolveSiteUrl({})).toBe(DEFAULT_SITE_URL);
  });
});
