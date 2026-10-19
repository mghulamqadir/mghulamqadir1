import { z } from "@/lib/schema";

export function parseDurationSeconds(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) throw new Error("JWT_EXPIRES_IN must use a duration such as 30m, 8h, or 7d.");
  const amount = Number(match[1]);
  const multiplier = { s: 1, m: 60, h: 3_600, d: 86_400 }[match[2].toLowerCase() as "s" | "m" | "h" | "d"];
  return amount * multiplier;
}

type SiteUrlEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

export const DEFAULT_SITE_URL = "https://mghulamqadir1.vercel.app";

export function resolveSiteUrl(source: SiteUrlEnvironment): string {
  const configured = source.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercelHost = source.VERCEL_PROJECT_PRODUCTION_URL?.trim() || source.VERCEL_URL?.trim();
  if (!vercelHost) return DEFAULT_SITE_URL;
  return /^https?:\/\//i.test(vercelHost) ? vercelHost : `https://${vercelHost}`;
}

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  MONGODB_URI: z.string().min(1).optional(),
  MONGODB_DB_NAME: z.string().min(1).default("portfolio"),
  MONGODB_MAX_POOL_SIZE: z.coerce.number().int().min(1).max(50).default(10),
  MONGODB_WAIT_QUEUE_TIMEOUT_MS: z.coerce.number().int().min(500).max(30_000).default(5_000),
  MONGODB_SOCKET_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(10_000),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().min(500).max(30_000).default(5_000),
  REQUEST_LOG_RETENTION_DAYS: z.coerce.number().int().min(1).max(3650).default(90),
  AUTH_SECRET: z.string().trim().min(32).optional(),
  JWT_EXPIRES_IN: z.string().trim().regex(/^\d+[smhd]$/i).default("8h").transform(parseDurationSeconds),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.email().optional(),
  BREVO_SENDER_NAME: z.string().trim().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
});

const parsedEnv = envSchema.parse({
  ...process.env,
  NEXT_PUBLIC_SITE_URL: resolveSiteUrl({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  }),
});
export const env = parsedEnv;

/** Call only in an authentication runtime path, never from public static rendering. */
export function requireAuthSecret(): string {
  if (!env.AUTH_SECRET) throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  return env.AUTH_SECRET;
}

export function hasMongo() {
  return Boolean(env.MONGODB_URI);
}

export function hasCloudinary() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
