import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  deliver: vi.fn(),
  insert: vi.fn(),
}));

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: mocks.after };
});
vi.mock("@/lib/email/deliver-contact-message", () => ({ deliverContactMessage: mocks.deliver }));
vi.mock("@/lib/repositories", () => ({ insertMessage: mocks.insert }));
vi.mock("@/lib/rate-limit", () => ({ isRateLimited: () => false }));
vi.mock("@/lib/logging/request-tracker", () => ({ getClientIpFromHeaders: () => "203.0.113.10" }));
vi.mock("@/lib/env", () => ({ env: { BREVO_API_KEY: "key", BREVO_SENDER_EMAIL: "sender@example.com" } }));

import { POST } from "@/app/api/contact/route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.insert.mockResolvedValue("message-id");
  });

  it("returns a pending response before background delivery runs", async () => {
    const request = new Request("https://portfolio.local/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", subject: "Project", message: "A sufficiently detailed message." }),
    });

    const response = await POST(request);
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({ ok: true, id: "message-id", delivery: "pending" });
    expect(mocks.insert).toHaveBeenCalledOnce();
    expect(mocks.after).toHaveBeenCalledOnce();
    expect(mocks.deliver).not.toHaveBeenCalled();

    await mocks.after.mock.calls[0][0]();
    expect(mocks.deliver).toHaveBeenCalledWith("message-id", expect.objectContaining({ email: "ada@example.com" }));
  });
});
