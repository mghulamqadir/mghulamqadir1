import { z } from "@/lib/schema";

const defaultSiteUrl = "https://mghulamqadir1.vercel.app";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  MONGODB_URI: z.string().min(1).optional(),
  MONGO_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).default("portfolio"),
  AUTH_SECRET: z.string().trim().min(32).optional(),
  NEXTAUTH_SECRET: z.string().trim().min(32).optional(),
  JWT_SECRET: z.string().trim().min(32).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.email().optional(),
  BREVO_SENDER_NAME: z.string().default("Ghulam Qadir Portfolio"),
  CONTACT_TO_EMAIL: z.email().default("mohammadghulam.qadir@gmail.com"),
  SENDER_EMAIL: z.email().optional(),
  SENDER_NAME: z.string().optional(),
}).transform(raw => {
  // Normalize site URL
  let siteUrl = (raw.NEXT_PUBLIC_SITE_URL || "").trim();
  if (!siteUrl) {
    siteUrl = defaultSiteUrl;
  } else if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
    siteUrl = `https://${siteUrl}`;
  }

  const resolvedSecret = raw.AUTH_SECRET || raw.NEXTAUTH_SECRET || raw.JWT_SECRET;

  return {
    ...raw,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    AUTH_SECRET: resolvedSecret,
    MONGODB_URI: raw.MONGODB_URI ?? raw.MONGO_URI,
    BREVO_SENDER_EMAIL: raw.BREVO_SENDER_EMAIL ?? raw.SENDER_EMAIL,
    BREVO_SENDER_NAME: raw.SENDER_NAME ?? raw.BREVO_SENDER_NAME,
  };
});

const parsedEnv = envSchema.parse(process.env);
export const env = { 
  ...parsedEnv, 
  NEXT_PUBLIC_SITE_URL: parsedEnv.NEXT_PUBLIC_SITE_URL as string,
  AUTH_SECRET: parsedEnv.AUTH_SECRET,
  MONGODB_URI: parsedEnv.MONGODB_URI ?? parsedEnv.MONGO_URI, 
  BREVO_SENDER_EMAIL: parsedEnv.BREVO_SENDER_EMAIL ?? parsedEnv.SENDER_EMAIL, 
  BREVO_SENDER_NAME: parsedEnv.SENDER_NAME ?? parsedEnv.BREVO_SENDER_NAME 
};

/** Call only in an authentication runtime path, never from public static rendering. */
export function requireAuthSecret(): string {
  if (!env.AUTH_SECRET) throw new Error("AUTH_SECRET (or NEXTAUTH_SECRET/JWT_SECRET) must be set to at least 32 characters.");
  return env.AUTH_SECRET;
}

export function hasMongo() {
  return Boolean(env.MONGODB_URI);
}

export function hasCloudinary() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
