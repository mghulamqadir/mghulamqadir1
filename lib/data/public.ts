import { cache } from "react";
import { unstable_cache } from "next/cache";
import { fallbackCertifications, fallbackExperiences, fallbackProjects, fallbackTechnologies, fallbackTestimonials } from "@/lib/data/fallback";
import type { Certification, Experience, Project, Technology, Testimonial } from "@/lib/types";
import { hasMongo } from "@/lib/env";
import * as repository from "@/lib/repositories";
import { PUBLIC_CONTENT_TAGS } from "@/lib/cache-tags";

const readProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const projects = await repository.getPublishedProjects();
    const seen = new Set<string>();
    return projects.filter((p) => {
      if (!p.slug || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
  },
  ["public-projects"],
  { tags: [PUBLIC_CONTENT_TAGS.projects] },
);

const readExperiences = unstable_cache(repository.getExperiences, ["public-experiences"], { tags: [PUBLIC_CONTENT_TAGS.experiences] });
const readTestimonials = unstable_cache(repository.getTestimonials, ["public-testimonials"], { tags: [PUBLIC_CONTENT_TAGS.testimonials] });
const readTechnologies = unstable_cache(repository.getTechnologies, ["public-technologies"], { tags: [PUBLIC_CONTENT_TAGS.technologies] });
const readCertifications = unstable_cache(repository.getCertifications, ["public-certifications"], { tags: [PUBLIC_CONTENT_TAGS.certifications] });

export const getProjects = cache(async (): Promise<Project[]> => hasMongo() ? readProjects() : fallbackProjects);
export async function getFeaturedProjects() { return (await getProjects()).filter((p) => p.featured).slice(0, 4); }
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  if (!hasMongo()) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  return (await getProjects()).find((project) => project.slug === slug) ?? null;
});
export const getExperiences = cache(async (): Promise<Experience[]> => hasMongo() ? readExperiences() : fallbackExperiences);
export const getTestimonials = cache(async (): Promise<Testimonial[]> => hasMongo() ? readTestimonials() : fallbackTestimonials);
export const getTechnologies = cache(async (): Promise<Technology[]> => hasMongo() ? readTechnologies() : fallbackTechnologies);
export const getCertifications = cache(async (): Promise<Certification[]> => hasMongo() ? readCertifications() : fallbackCertifications);
