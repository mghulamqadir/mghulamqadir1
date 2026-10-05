import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  MONGODB_URI: z.string().min(1).optional(),
  MONGO_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).default("portfolio"),
  AUTH_SECRET: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().default("Ghulam Qadir Portfolio"),
  CONTACT_TO_EMAIL: z.string().email().default("mohammadghulam.qadir@gmail.com"),
  SENDER_EMAIL: z.string().email().optional(),
  SENDER_NAME: z.string().optional(),
}).transform(env => ({
  ...env,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://mghulamqadir.dev"),
  AUTH_SECRET: env.AUTH_SECRET || env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "development_secret_32_chars_minimum" : undefined)
})).refine(env => !!env.AUTH_SECRET && env.AUTH_SECRET.length >= 32, {
  message: "AUTH_SECRET (or JWT_SECRET) must be set to at least 32 characters in production",
  path: ["AUTH_SECRET"]
});

const parsedEnv = envSchema.parse(process.env);
export const env = { 
  ...parsedEnv, 
  NEXT_PUBLIC_SITE_URL: parsedEnv.NEXT_PUBLIC_SITE_URL as string,
  AUTH_SECRET: parsedEnv.AUTH_SECRET as string,
  MONGODB_URI: parsedEnv.MONGODB_URI ?? parsedEnv.MONGO_URI, 
  BREVO_SENDER_EMAIL: parsedEnv.BREVO_SENDER_EMAIL ?? parsedEnv.SENDER_EMAIL, 
  BREVO_SENDER_NAME: parsedEnv.SENDER_NAME ?? parsedEnv.BREVO_SENDER_NAME 
};

export function hasMongo() {
  return Boolean(env.MONGODB_URI);
}

export function hasCloudinary() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
