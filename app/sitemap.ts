import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/public";
import { env } from "@/lib/env";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = env.NEXT_PUBLIC_SITE_URL; const pages = ["", "/about", "/projects", "/experience", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); return [...pages, ...(await getProjects()).map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date() }))]; }
