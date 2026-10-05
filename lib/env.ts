import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.npm_lifecycle_event === "build" ||
  Boolean(process.env.NEXT_IS_BUILDING);

const defaultSiteUrl = isProduction
  ? "https://mghulamqadir1.vercel.app"
  : "http://localhost:3000";

const defaultAuthSecret = "development_or_build_secret_32_chars_minimum";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  MONGODB_URI: z.string().min(1).optional(),
  MONGO_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).default("portfolio"),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().default("Ghulam Qadir Portfolio"),
  CONTACT_TO_EMAIL: z.string().email().default("mohammadghulam.qadir@gmail.com"),
  SENDER_EMAIL: z.string().email().optional(),
  SENDER_NAME: z.string().optional(),
}).transform(raw => {
  // Normalize site URL
  let siteUrl = (raw.NEXT_PUBLIC_SITE_URL || "").trim();
  if (!siteUrl) {
    siteUrl = defaultSiteUrl;
  } else if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
    siteUrl = `https://${siteUrl}`;
  }

  // Resolve auth secret from AUTH_SECRET, NEXTAUTH_SECRET, or JWT_SECRET
  const providedSecret = (raw.AUTH_SECRET || raw.NEXTAUTH_SECRET || raw.JWT_SECRET || "").trim();
  let resolvedSecret = providedSecret;

  if (!resolvedSecret) {
    // Fall back to safe 32-char placeholder during build or development so static compilation never fails
    resolvedSecret = defaultAuthSecret;
    if (isProduction && !isBuild) {
      console.warn(
        "[SECURITY WARNING] Neither AUTH_SECRET nor NEXTAUTH_SECRET is set in production. Using fallback secret. Please configure a 32+ character AUTH_SECRET in your production environment."
      );
    }
  } else if (resolvedSecret.length < 32 && isProduction && !isBuild) {
    console.warn(
      `[SECURITY WARNING] AUTH_SECRET is only ${resolvedSecret.length} characters long. A secret of at least 32 characters is strongly recommended.`
    );
  }

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
