import { beforeEach, describe, expect, it, vi } from "vitest";

const repositories = vi.hoisted(() => ({
  getPublishedProjects: vi.fn(),
  getExperiences: vi.fn(),
  getTestimonials: vi.fn(),
  getTechnologies: vi.fn(),
  getCertifications: vi.fn(),
}));

vi.mock("react", async (importOriginal) => ({ ...(await importOriginal<typeof import("react")>()), cache: <T extends (...args: never[]) => unknown>(fn: T) => fn }));
vi.mock("next/cache", () => ({ unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn, revalidateTag: vi.fn() }));
vi.mock("@/lib/env", () => ({ hasMongo: () => true }));
vi.mock("@/lib/repositories", () => repositories);

import { getProjects } from "@/lib/data/public";

describe("public CMS data", () => {
  beforeEach(() => vi.clearAllMocks());

  it("treats an empty projects collection as intentional", async () => {
    repositories.getPublishedProjects.mockResolvedValue([]);
    await expect(getProjects()).resolves.toEqual([]);
  });

  it("does not hide configured database failures behind fallback data", async () => {
    repositories.getPublishedProjects.mockRejectedValue(new Error("database unavailable"));
    await expect(getProjects()).rejects.toThrow("database unavailable");
  });
});
