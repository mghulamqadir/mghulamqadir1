import { describe, expect, it } from "vitest";
import { contactSchema, projectSchema } from "@/lib/validations";
import { deleteRequestLogsSchema } from "@/lib/schema";

describe("validation", () => {
  it("accepts a valid contact message", () => { expect(contactSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com", subject: "Hello", message: "This is a valid message." }).success).toBe(true); });
  it("rejects a honeypot submission", () => { expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", subject: "Hello", message: "This is long enough.", website: "bot" }).success).toBe(false); });
  it("requires a URL-safe project slug", () => { expect(projectSchema.safeParse({ title: "Test", slug: "not valid", short_description: "A valid description", company: "", role: "", category: "AI", status: "draft", featured: false }).success).toBe(false); });
  it("validates deleteRequestLogsSchema correctly", () => {
    expect(deleteRequestLogsSchema.safeParse({}).success).toBe(false);
    expect(deleteRequestLogsSchema.safeParse({ ids: [] }).success).toBe(false);
    expect(deleteRequestLogsSchema.safeParse({ ips: [] }).success).toBe(false);
    expect(deleteRequestLogsSchema.safeParse({ ids: ["abc-123"] }).success).toBe(true);
    expect(deleteRequestLogsSchema.safeParse({ ips: ["192.168.1.1"] }).success).toBe(true);
    expect(deleteRequestLogsSchema.safeParse({ all: true }).success).toBe(true);
  });
});
