import { revalidateTag } from "next/cache";

export const PUBLIC_CONTENT_TAGS = {
  projects: "public-projects",
  experiences: "public-experiences",
  testimonials: "public-testimonials",
  technologies: "public-technologies",
  certifications: "public-certifications",
} as const;

export function revalidatePublicContent(tags: Array<keyof typeof PUBLIC_CONTENT_TAGS>) {
  for (const tag of tags) revalidateTag(PUBLIC_CONTENT_TAGS[tag], { expire: 0 });
}
