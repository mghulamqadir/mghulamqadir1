import { beforeEach, describe, expect, it, vi } from "vitest";

const getAdminSession = vi.hoisted(() => vi.fn());
vi.mock("@/lib/auth", () => ({ getAdminSession }));

import { requireAdminApi } from "@/lib/api-auth";

describe("admin API authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects unauthenticated requests", async () => {
    getAdminSession.mockResolvedValue(null);
    const result = await requireAdminApi(new Request("https://portfolio.local/api/admin/projects"));
    expect("response" in result).toBe(true);
    if (result.response) expect(result.response.status).toBe(401);
  });

  it("rejects cross-origin mutations", async () => {
    getAdminSession.mockResolvedValue({ user: { id: "admin", email: "owner@example.com", role: "admin" } });
    const request = new Request("https://portfolio.local/api/admin/projects", { headers: { host: "portfolio.local", origin: "https://attacker.example" } });
    const result = await requireAdminApi(request);
    expect("response" in result).toBe(true);
    if (result.response) expect(result.response.status).toBe(403);
  });
});
