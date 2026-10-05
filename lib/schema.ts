import { z } from "zod";

export { z };

/** Zod 4 helpers shared by every request/configuration validator. */
export const emailSchema = z.email().max(200);
export const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
export const httpUrlSchema = z.url().max(500).refine((value) => /^https?:\/\//.test(value), "Only HTTP(S) URLs are allowed");
export const optionalHttpUrl = z.union([z.literal(""), httpUrlSchema]).optional();
export const contactMessageStatusSchema = z.object({ status: z.enum(["unread", "read", "archived"]) }).strict();

export const siteSettingsSchema = z.object({
  profile: z.object({
    full_name: optionalText(160), headline: optionalText(180), short_bio: optionalText(500),
    long_bio: optionalText(10_000), location: optionalText(160),
    email: z.union([z.literal(""), emailSchema]).optional(), availability_status: optionalText(120),
  }).strict(),
  homepage: z.object({ hero_eyebrow: optionalText(180), hero_title: optionalText(240), hero_description: optionalText(1_000) }).strict(),
  seo: z.object({ title: optionalText(120), description: optionalText(300) }).strict(),
  contact: z.object({ email: z.union([z.literal(""), emailSchema]).optional() }).strict(),
  resume: z.object({ secure_url: optionalHttpUrl, public_id: optionalText(500) }).strict(),
}).strict();
