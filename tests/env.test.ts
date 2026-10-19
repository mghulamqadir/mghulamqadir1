import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_URL,
  parseDurationSeconds,
  resolveAuthSecret,
  resolveMongoUri,
  resolveSiteUrl,
} from "@/lib/env";

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

  it("prefers AUTH_SECRET and supports deployed legacy secret names", () => {
    expect(resolveAuthSecret({ AUTH_SECRET: "canonical", NEXTAUTH_SECRET: "legacy" })).toBe("canonical");
    expect(resolveAuthSecret({ NEXTAUTH_SECRET: "next-auth-secret" })).toBe("next-auth-secret");
    expect(resolveAuthSecret({ JWT_SECRET: "jwt-secret" })).toBe("jwt-secret");
  });

  it("prefers MONGODB_URI and supports the deployed MONGO_URI name", () => {
    expect(resolveMongoUri({ MONGODB_URI: "mongodb://canonical", MONGO_URI: "mongodb://legacy" }))
      .toBe("mongodb://canonical");
    expect(resolveMongoUri({ MONGO_URI: "mongodb://legacy" })).toBe("mongodb://legacy");
  });
});
