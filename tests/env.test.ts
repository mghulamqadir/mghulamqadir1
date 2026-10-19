import { describe, expect, it } from "vitest";
import { parseDurationSeconds } from "@/lib/env";

describe("environment parsing", () => {
  it("parses seconds", () => expect(parseDurationSeconds("30s")).toBe(30));
  it("parses hours", () => expect(parseDurationSeconds("8h")).toBe(28_800));
  it("parses days", () => expect(parseDurationSeconds("7d")).toBe(604_800));
});
