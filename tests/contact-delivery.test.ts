import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ update: vi.fn() }));
vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_SITE_URL: "https://portfolio.test",
    BREVO_API_KEY: "key",
    BREVO_SENDER_EMAIL: "sender@example.com",
    BREVO_SENDER_NAME: "Portfolio",
    CONTACT_TO_EMAIL: "owner@example.com",
  },
}));
vi.mock("@/lib/repositories/messages", () => ({ updateMessage: mocks.update }));

import { BREVO_TIMEOUT_MS, deliverContactMessage } from "@/lib/email/deliver-contact-message";

const message = { name: "Ada Lovelace", email: "ada@example.com", subject: "Project", message: "A sufficiently detailed message." };

describe("contact email delivery", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.update.mockReset().mockResolvedValue({});
  });

  it("marks a successful Brevo delivery as sent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ messageId: "brevo-id" }), { status: 201 })));
    await deliverContactMessage("message-id", message);
    expect(mocks.update).toHaveBeenCalledWith("message-id", { email_status: "sent", brevo_message_id: "brevo-id" });
    expect(BREVO_TIMEOUT_MS).toBe(8_000);
  });

  it("marks failed delivery attempts as failed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    await deliverContactMessage("message-id", message);
    expect(mocks.update).toHaveBeenCalledWith("message-id", { email_status: "failed" });
  });
});
