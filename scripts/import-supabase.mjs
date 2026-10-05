import "dotenv/config";
import { MongoClient } from "mongodb";

const { MONGO_URI, MONGODB_DB_NAME = "portfolio", SUPABASE_IMPORT_URL, SUPABASE_IMPORT_SERVICE_ROLE_KEY } = process.env;
if (!MONGO_URI || !SUPABASE_IMPORT_URL || !SUPABASE_IMPORT_SERVICE_ROLE_KEY) throw new Error("MONGO_URI, SUPABASE_IMPORT_URL, and SUPABASE_IMPORT_SERVICE_ROLE_KEY are required.");

const collections = ["profiles", "projects", "technologies", "project_technologies", "project_images", "testimonials", "experiences", "experience_highlights", "skills", "education", "certifications", "social_links", "contact_submissions", "site_settings", "audit_logs"];
const client = new MongoClient(MONGO_URI);

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
  const target = client.db(MONGODB_DB_NAME);
  for (const name of collections) {
    const rows = await sourceRows(name);
    const operations = rows.map((row) => {
      const filter = name === "site_settings" ? { key: row.key } : { id: row.id };
      return { replaceOne: { filter, replacement: row, upsert: true } };
    });
    if (operations.length) await target.collection(name).bulkWrite(operations, { ordered: false });
    const count = await target.collection(name).countDocuments();
    console.log(`${name}: ${rows.length} source rows, ${count} MongoDB rows`);
  }
} finally { await client.close(); }
