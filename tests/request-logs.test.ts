import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  insertOne: vi.fn(),
  aggregate: vi.fn(),
}));

vi.mock("@/lib/database/mongodb", () => ({ collection: async () => database }));
vi.mock("@/lib/env", () => ({ hasMongo: () => true }));

import { escapePrefixRegex, getGroupedRequestLogsByIp, recordRequestLog } from "@/lib/repositories/request-logs";

describe("request log persistence and queries", () => {
  beforeEach(() => vi.clearAllMocks());

  it("escapes user-controlled regular-expression characters", () => {
    expect(escapePrefixRegex("/projects/(draft).*")).toBe("/projects/\\(draft\\)\\.\\*");
  });

  it("stores new timestamps as BSON-compatible Date values", async () => {
    database.insertOne.mockResolvedValue({ acknowledged: true });
    await recordRequestLog({ ip: "203.0.113.1", method: "GET", path: "/projects" });
    expect(database.insertOne).toHaveBeenCalledWith(expect.objectContaining({ created_at: expect.any(Date) }));
  });

  it("limits each grouped visitor timeline to the latest 100 records", async () => {
    const now = new Date("2026-10-19T10:00:00.000Z");
    database.aggregate
      .mockReturnValueOnce({ toArray: async () => [{ metadata: [{ total: 1 }], data: [{ _id: "203.0.113.1", total_requests: 150, first_seen: now, last_seen: now }] }] })
      .mockReturnValueOnce({ toArray: async () => [{ ip: "203.0.113.1", method: "GET", path: "/", created_at: now, visit_rank: 1 }] });

    const result = await getGroupedRequestLogsByIp();
    expect(result.groups[0]).toMatchObject({ visits_truncated: true, visits: [{ created_at: now.toISOString() }] });
    const visitPipeline = database.aggregate.mock.calls[1][0] as Array<Record<string, unknown>>;
    expect(visitPipeline).toContainEqual({ $match: { visit_rank: { $lte: 100 } } });
  });
});
