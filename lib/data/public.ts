import { cache } from "react";
import { fallbackExperiences, fallbackProjects, fallbackTechnologies, fallbackTestimonials } from "@/lib/data/fallback";
import type { Experience, Project, Technology, Testimonial } from "@/lib/types";
import { hasMongo } from "@/lib/env";
import * as repository from "@/lib/repositories";

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!hasMongo()) return fallbackProjects;
  try { const projects = await repository.getPublishedProjects(); return projects.length ? projects : fallbackProjects; } catch (error) { console.error("Serving fallback projects", { message: error instanceof Error ? error.message : "unknown" }); return fallbackProjects; }
});
export async function getFeaturedProjects() { return (await getProjects()).filter((p) => p.featured).slice(0, 4); }
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  if (!hasMongo()) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  try { 
    const project = await repository.getPublishedProject(slug);
    if (!project) {
      return fallbackProjects.find((p) => p.slug === slug) ?? null;
    }
    return project;
  } catch (error) { 
    console.error("Serving fallback project", { message: error instanceof Error ? error.message : "unknown" }); 
    return fallbackProjects.find((project) => project.slug === slug) ?? null; 
  }
});
export const getExperiences = cache(async (): Promise<Experience[]> => {
  if (!hasMongo()) return fallbackExperiences;
  try { const experiences = await repository.getExperiences(); return experiences.length ? experiences : fallbackExperiences; } catch (error) { console.error("Serving fallback experiences", { message: error instanceof Error ? error.message : "unknown" }); return fallbackExperiences; }
});
export const getTestimonials = cache(async (): Promise<Testimonial[]> => { if (!hasMongo()) return fallbackTestimonials; try { const testimonials = await repository.getTestimonials(); return testimonials.length ? testimonials : fallbackTestimonials; } catch (error) { console.error("Serving fallback testimonials", { message: error instanceof Error ? error.message : "unknown" }); return fallbackTestimonials; } });
export const getTechnologies = cache(async (): Promise<Technology[]> => { if (!hasMongo()) return fallbackTechnologies; try { const technologies = await repository.getTechnologies(); return technologies.length ? technologies : fallbackTechnologies; } catch (error) { console.error("Serving fallback technologies", { message: error instanceof Error ? error.message : "unknown" }); return fallbackTechnologies; } });
