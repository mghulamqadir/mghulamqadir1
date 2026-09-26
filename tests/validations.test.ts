import { describe, expect, it } from "vitest";
import { contactSchema, projectSchema } from "@/lib/validations";
describe("validation", () => {
  it("accepts a valid contact message", () => { expect(contactSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com", subject: "Hello", message: "This is a valid message." }).success).toBe(true); });
  it("rejects a honeypot submission", () => { expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", subject: "Hello", message: "This is long enough.", website: "bot" }).success).toBe(false); });
  it("requires a URL-safe project slug", () => { expect(projectSchema.safeParse({ title: "Test", slug: "not valid", short_description: "A valid description", company: "", role: "", category: "AI", status: "draft", featured: false }).success).toBe(false); });
});
