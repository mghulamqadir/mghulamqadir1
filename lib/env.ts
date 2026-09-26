import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().default("Ghulam Qadir Portfolio"),
  CONTACT_TO_EMAIL: z.string().email().default("mohammadghulam.qadir@gmail.com"),
  SENDER_EMAIL: z.string().email().optional(),
  SENDER_NAME: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);
export const env = { ...parsedEnv, BREVO_SENDER_EMAIL: parsedEnv.BREVO_SENDER_EMAIL ?? parsedEnv.SENDER_EMAIL, BREVO_SENDER_NAME: parsedEnv.SENDER_NAME ?? parsedEnv.BREVO_SENDER_NAME };

export function hasSupabase() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function hasCloudinary() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
