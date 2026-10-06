import { httpUrlSchema, optionalHttpUrl, optionalText, z } from "@/lib/schema";

const common = { sort_order: z.coerce.number().int().min(0).max(10000).default(0) };

export const contentSchemas = {
  testimonials: z.object({ name: z.string().trim().min(2).max(120), job_title: optionalText(120), company: optionalText(120), testimonial: z.string().trim().min(10).max(5000), source_url: optionalHttpUrl, featured: z.boolean(), status: z.enum(["draft", "published"]), ...common }),
  experiences: z.object({ company: z.string().trim().min(2).max(120), role: z.string().trim().min(2).max(120), location: optionalText(120), start_date: z.iso.date(), end_date: z.union([z.literal(""), z.iso.date()]).optional(), current_role: z.boolean(), description: optionalText(10000), company_url: optionalHttpUrl, ...common }),
  skills: z.object({ name: z.string().trim().min(1).max(100), category: z.string().trim().min(1).max(80), icon: optionalText(100), featured: z.boolean(), ...common }),
  education: z.object({ institution: z.string().trim().min(2).max(160), degree: optionalText(160), field: optionalText(160), location: optionalText(120), start_date: z.union([z.literal(""), z.iso.date()]).optional(), end_date: z.union([z.literal(""), z.iso.date()]).optional(), description: optionalText(5000), ...common }),
  certifications: z.object({ name: z.string().trim().min(2).max(160), issuer: optionalText(160), issue_date: z.union([z.literal(""), z.iso.date()]).optional(), date_label: optionalText(80), credential_url: optionalHttpUrl, credential_id: optionalText(160), image_url: optionalHttpUrl, image_public_id: optionalText(500), ...common }),
  social_links: z.object({ platform: z.string().trim().min(2).max(80), url: httpUrlSchema, icon: optionalText(100), enabled: z.boolean(), ...common }),
} as const;

export type ContentResource = keyof typeof contentSchemas;
export function isContentResource(value: string): value is ContentResource { return value in contentSchemas; }
export const contentLabels: Record<ContentResource, string> = { testimonials: "Testimonials", experiences: "Experience", skills: "Skills", education: "Education", certifications: "Certifications", social_links: "Social links" };
