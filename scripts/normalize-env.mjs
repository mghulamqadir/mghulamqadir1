import { readFile, writeFile } from "node:fs/promises";
import { LEGACY_ENV_ALIASES } from "./env-contract.mjs";

const file = new URL("../.env", import.meta.url);
const exampleFile = new URL("../.env.example", import.meta.url);
const source = await readFile(file, "utf8");
const exampleSource = await readFile(exampleFile, "utf8");
const newline = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(/\r?\n/);
const present = new Set();
const changes = [];

for (let index = 0; index < lines.length; index += 1) {
  const match = lines[index].match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (!match) continue;
  const [, key, value] = match;
  const canonical = LEGACY_ENV_ALIASES[key] || key;
  if (canonical !== key) {
    if (present.has(canonical) || lines.some((line) => line.startsWith(`${canonical}=`))) {
      throw new Error(`Both ${key} and ${canonical} exist. Resolve the duplicate before normalization.`);
    }
    lines[index] = `${canonical}=${value}`;
    changes.push(`${key} -> ${canonical}`);
  }
  present.add(canonical);
}

const defaultableKeys = new Set([
  "NEXT_PUBLIC_SITE_URL", "MONGODB_MAX_POOL_SIZE", "MONGODB_WAIT_QUEUE_TIMEOUT_MS",
  "MONGODB_SOCKET_TIMEOUT_MS", "MONGODB_SERVER_SELECTION_TIMEOUT_MS",
  "REQUEST_LOG_RETENTION_DAYS", "CONTACT_TO_EMAIL",
]);
const defaults = Object.fromEntries(exampleSource.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  return match && defaultableKeys.has(match[1]) ? [[match[1], match[2]]] : [];
}));

for (const [key, value] of Object.entries(defaults)) {
  if (!present.has(key)) {
    lines.push(`${key}=${value}`);
    changes.push(`added ${key}`);
  }
}

await writeFile(file, `${lines.filter((line, index) => line || index < lines.length - 1).join(newline)}${newline}`, "utf8");
console.log(changes.length ? `Normalized .env: ${changes.join(", ")}.` : ".env already uses canonical names.");
