import "dotenv/config";
import { MongoClient } from "mongodb";
import { mongoScriptEnv, requireEnv } from "./env-contract.mjs";

const { uri, dbName } = mongoScriptEnv();
const SUPABASE_IMPORT_URL = requireEnv("SUPABASE_IMPORT_URL");
const SUPABASE_IMPORT_SERVICE_ROLE_KEY = requireEnv("SUPABASE_IMPORT_SERVICE_ROLE_KEY");

const collections = ["profiles", "projects", "technologies", "project_technologies", "project_images", "testimonials", "experiences", "experience_highlights", "skills", "education", "certifications", "social_links", "contact_submissions", "site_settings", "audit_logs"];
const client = new MongoClient(uri);

async function sourceRows(name) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await fetch(`${SUPABASE_IMPORT_URL.replace(/\/$/, "")}/rest/v1/${name}?select=*&offset=${offset}&limit=1000`, { headers: { apikey: SUPABASE_IMPORT_SERVICE_ROLE_KEY, authorization: `Bearer ${SUPABASE_IMPORT_SERVICE_ROLE_KEY}`, Range: `${offset}-${offset + 999}` } });
    if (!response.ok) throw new Error(`Unable to export ${name}: ${response.status} ${await response.text()}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

await client.connect();
try {
  const target = client.db(dbName);
  for (const name of collections) {
    const rows = await sourceRows(name);
    const operations = rows.map((row) => {
      const filter = name === "site_settings" ? { key: row.key } : { id: row.id };
      const replacement = name === "audit_logs" && typeof row.created_at === "string"
        ? { ...row, created_at: new Date(row.created_at) }
        : row;
      return { replaceOne: { filter, replacement, upsert: true } };
    });
    if (operations.length) await target.collection(name).bulkWrite(operations, { ordered: false });
    const count = await target.collection(name).countDocuments();
    console.log(`${name}: ${rows.length} source rows, ${count} MongoDB rows`);
  }
} finally { await client.close(); }
