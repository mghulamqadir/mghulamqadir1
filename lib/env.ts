import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
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
});

const parsedEnv = envSchema.parse(process.env);
const authSecret = parsedEnv.AUTH_SECRET ?? parsedEnv.JWT_SECRET;
if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error("AUTH_SECRET (or the legacy JWT_SECRET) must be set to at least 32 characters in production.");
}
export const env = { ...parsedEnv, AUTH_SECRET: authSecret, MONGODB_URI: parsedEnv.MONGODB_URI ?? parsedEnv.MONGO_URI, BREVO_SENDER_EMAIL: parsedEnv.BREVO_SENDER_EMAIL ?? parsedEnv.SENDER_EMAIL, BREVO_SENDER_NAME: parsedEnv.SENDER_NAME ?? parsedEnv.BREVO_SENDER_NAME };

export function hasMongo() {
  return Boolean(env.MONGODB_URI);
}

export function hasCloudinary() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
