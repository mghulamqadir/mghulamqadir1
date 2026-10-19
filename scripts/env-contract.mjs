export const APP_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "MONGODB_MAX_POOL_SIZE",
  "MONGODB_WAIT_QUEUE_TIMEOUT_MS",
  "MONGODB_SOCKET_TIMEOUT_MS",
  "MONGODB_SERVER_SELECTION_TIMEOUT_MS",
  "REQUEST_LOG_RETENTION_DAYS",
  "AUTH_SECRET",
  "JWT_EXPIRES_IN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
  "BREVO_SENDER_NAME",
  "CONTACT_TO_EMAIL",
];

export const SCRIPT_ENV_KEYS = [
  "BOOTSTRAP_ADMIN_EMAIL",
  "BOOTSTRAP_ADMIN_PASSWORD",
  "SUPABASE_IMPORT_URL",
  "SUPABASE_IMPORT_SERVICE_ROLE_KEY",
];

export const UNUSED_ENV_KEYS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

export const LEGACY_ENV_ALIASES = {
  MONGO_URI: "MONGODB_URI",
  JWT_SECRET: "AUTH_SECRET",
  NEXTAUTH_SECRET: "AUTH_SECRET",
  SENDER_EMAIL: "BREVO_SENDER_EMAIL",
  SENDER_NAME: "BREVO_SENDER_NAME",
};

export function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

export function integerEnv(name, fallback, min, max) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer from ${min} to ${max}.`);
  }
  return value;
}

export function mongoScriptEnv() {
  return {
    uri: requireEnv("MONGODB_URI"),
    dbName: process.env.MONGODB_DB_NAME?.trim() || "portfolio",
  };
}
