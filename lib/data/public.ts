import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { fallbackExperiences, fallbackProjects, fallbackTechnologies, fallbackTestimonials } from "@/lib/data/fallback";
import type { Experience, Project, Technology, Testimonial } from "@/lib/types";

type ProjectRow = Omit<Project, "technologies"> & { technologies?: Array<{ technology: Technology | null }> };
type ExperienceRow = Omit<Experience, "highlights"> & { highlights?: Array<{ content: string }> };

function toProject(row: ProjectRow): Project {
  const { technologies, ...project } = row;
  return { ...project, technologies: technologies?.flatMap((relation) => relation.technology ? [relation.technology] : []) ?? [] };
}

function toExperience(row: ExperienceRow): Experience {
  const { highlights, ...experience } = row;
  return { ...experience, highlights: highlights?.map((highlight) => highlight.content) ?? [] };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const db = await createClient();
  if (!db) return fallbackProjects;
  const { data, error } = await db.from("projects").select("*, technologies:project_technologies(technology:technologies(*)), images:project_images(*)").eq("status", "published").order("sort_order");
  if (error) { console.error("Unable to load published projects", { code: error.code }); return fallbackProjects; }
  return (data as ProjectRow[]).map(toProject);
});
export async function getFeaturedProjects() { return (await getProjects()).filter((p) => p.featured).slice(0, 4); }
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const db = await createClient();
  if (!db) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db.from("projects").select("*, technologies:project_technologies(technology:technologies(*)), images:project_images(*)").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) { console.error("Unable to load project", { code: error.code }); return null; }
  return data ? toProject(data as ProjectRow) : null;
});
export const getExperiences = cache(async (): Promise<Experience[]> => {
  const db = await createClient();
  if (!db) return fallbackExperiences;
  const { data, error } = await db.from("experiences").select("*, highlights:experience_highlights(content)").order("sort_order");
  if (error) { console.error("Unable to load experiences", { code: error.code }); return fallbackExperiences; }
  return (data as ExperienceRow[]).map(toExperience);
});
export async function getTestimonials(): Promise<Testimonial[]> { const db = await createClient(); if (!db) return fallbackTestimonials; const { data, error } = await db.from("testimonials").select("*").eq("status", "published").eq("featured", true).order("sort_order").limit(3); if (error) { console.error("Unable to load testimonials", { code: error.code }); return fallbackTestimonials; } return (data as Testimonial[]) ?? []; }
export async function getTechnologies(): Promise<Technology[]> { const db = await createClient(); if (!db) return fallbackTechnologies; const { data, error } = await db.from("technologies").select("*").order("category").order("sort_order"); if (error) { console.error("Unable to load technologies", { code: error.code }); return fallbackTechnologies; } return (data as Technology[]) ?? []; }
