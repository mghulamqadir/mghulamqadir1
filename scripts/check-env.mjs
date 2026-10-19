import "dotenv/config";
import { readFile } from "node:fs/promises";
import { APP_ENV_KEYS, LEGACY_ENV_ALIASES, SCRIPT_ENV_KEYS, UNUSED_ENV_KEYS } from "./env-contract.mjs";

const source = await readFile(new URL("../.env", import.meta.url), "utf8");
const keys = source.split(/\r?\n/).flatMap((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/)?.[1] || []);
const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))];
const known = new Set([...APP_ENV_KEYS, ...SCRIPT_ENV_KEYS, ...UNUSED_ENV_KEYS]);
const legacy = keys.filter((key) => key in LEGACY_ENV_ALIASES);
const unknown = keys.filter((key) => !known.has(key) && !(key in LEGACY_ENV_ALIASES));
const missing = APP_ENV_KEYS.filter((key) => !process.env[key]?.trim());
const invalid = [];
const checkInteger = (name, min, max) => {
  const value = Number(process.env[name]);
  if (!Number.isInteger(value) || value < min || value > max) invalid.push(name);
};
const checkUrl = (name, protocols) => {
  try {
    const url = new URL(process.env[name]);
    if (!protocols.includes(url.protocol)) invalid.push(name);
  } catch { invalid.push(name); }
};
const checkEmail = (name) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env[name] || "")) invalid.push(name);
};

if ((process.env.AUTH_SECRET || "").trim().length < 32) invalid.push("AUTH_SECRET");
if (!/^\d+[smhd]$/i.test(process.env.JWT_EXPIRES_IN || "")) invalid.push("JWT_EXPIRES_IN");
if ((process.env.BOOTSTRAP_ADMIN_PASSWORD || "").length < 12) invalid.push("BOOTSTRAP_ADMIN_PASSWORD");
checkUrl("NEXT_PUBLIC_SITE_URL", ["http:", "https:"]);
checkUrl("MONGODB_URI", ["mongodb:", "mongodb+srv:"]);
checkUrl("SUPABASE_IMPORT_URL", ["http:", "https:"]);
checkInteger("MONGODB_MAX_POOL_SIZE", 1, 50);
checkInteger("MONGODB_WAIT_QUEUE_TIMEOUT_MS", 500, 30_000);
checkInteger("MONGODB_SOCKET_TIMEOUT_MS", 1_000, 60_000);
checkInteger("MONGODB_SERVER_SELECTION_TIMEOUT_MS", 500, 30_000);
checkInteger("REQUEST_LOG_RETENTION_DAYS", 1, 3650);
for (const name of ["BREVO_SENDER_EMAIL", "CONTACT_TO_EMAIL", "BOOTSTRAP_ADMIN_EMAIL"]) checkEmail(name);

if (duplicates.length) console.error(`Duplicate keys: ${duplicates.join(", ")}`);
if (legacy.length) console.error(`Legacy keys: ${legacy.map((key) => `${key} (use ${LEGACY_ENV_ALIASES[key]})`).join(", ")}`);
if (unknown.length) console.error(`Unknown keys (possible typos): ${unknown.join(", ")}`);
if (missing.length) console.error(`Missing application keys: ${missing.join(", ")}`);
if (invalid.length) console.error(`Invalid values: ${[...new Set(invalid)].join(", ")}`);

const unused = keys.filter((key) => UNUSED_ENV_KEYS.includes(key));
if (unused.length) console.warn(`Unused preserved keys: ${unused.join(", ")}`);

if (duplicates.length || legacy.length || unknown.length || missing.length || invalid.length) process.exitCode = 1;
else console.log(`Environment contract valid: ${keys.length} keys checked; values were not printed.`);
