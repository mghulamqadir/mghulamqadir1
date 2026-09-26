import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/public";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const pages = ["", "/about", "/projects", "/experience", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); return [...pages, ...(await getProjects()).map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date() }))]; }
