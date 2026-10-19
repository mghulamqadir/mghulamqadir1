import "dotenv/config";
import { MongoClient } from "mongodb";
import { integerEnv, mongoScriptEnv } from "./env-contract.mjs";

const { uri, dbName } = mongoScriptEnv();
const retentionDays = integerEnv("REQUEST_LOG_RETENTION_DAYS", 90, 1, 3650);
const client = new MongoClient(uri);
await client.connect();

try {
  const db = client.db(dbName);

  const indexDefinitions = [
    { coll: "profiles", spec: { email: 1 }, options: { unique: true, sparse: true } },
    { coll: "projects", spec: { slug: 1 }, options: { unique: true } },
    { coll: "projects", spec: { status: 1, featured: 1, sort_order: 1 } },
    { coll: "technologies", spec: { name: 1 }, options: { unique: true } },
    { coll: "project_technologies", spec: { project_id: 1, technology_id: 1 }, options: { unique: true } },
    { coll: "project_images", spec: { project_id: 1, sort_order: 1 } },
    { coll: "experience_highlights", spec: { experience_id: 1, sort_order: 1 } },
    { coll: "experiences", spec: { sort_order: 1 } },
    { coll: "testimonials", spec: { sort_order: 1 } },
    { coll: "skills", spec: { sort_order: 1 } },
    { coll: "education", spec: { sort_order: 1 } },
    { coll: "certifications", spec: { sort_order: 1 } },
    { coll: "social_links", spec: { sort_order: 1 } },
    { coll: "contact_submissions", spec: { status: 1, created_at: -1 } },
    { coll: "audit_logs", spec: { created_at: 1 }, options: { expireAfterSeconds: 60 * 60 * 24 * 365 } },
    { coll: "audit_logs", spec: { created_at: -1 } },
    { coll: "audit_logs", spec: { user_id: 1 } },
    { coll: "audit_logs", spec: { entity: 1, entity_id: 1, created_at: -1 } },
    { coll: "request_logs", spec: { created_at: -1 } },
    { coll: "request_logs", spec: { ip: 1, created_at: -1 } },
    { coll: "request_logs", spec: { path: 1, created_at: -1 } },
    { coll: "request_logs", spec: { id: 1 }, options: { unique: true } },
    { coll: "request_logs", spec: { created_at: 1 }, options: { expireAfterSeconds: 60 * 60 * 24 * retentionDays } },
    { coll: "site_settings", spec: { key: 1 }, options: { unique: true } },
  ];

  for (const { coll, spec, options } of indexDefinitions) {
    try {
      await db.collection(coll).createIndex(spec, options || {});
      console.log(`✓ Index created on ${coll}:`, JSON.stringify(spec));
    } catch (err) {
      if (options?.expireAfterSeconds !== undefined) {
        const indexes = await db.collection(coll).indexes();
        const existing = indexes.find((index) => JSON.stringify(index.key) === JSON.stringify(spec));
        if (existing) {
          await db.command({ collMod: coll, index: { name: existing.name, expireAfterSeconds: options.expireAfterSeconds } });
          console.log(`✓ TTL updated on ${coll}:`, JSON.stringify(spec));
          continue;
        }
      }
      console.warn(`! Skipped index on ${coll} (${JSON.stringify(spec)}):`, err instanceof Error ? err.message : String(err));
    }
  }

  console.log("\nMongoDB index creation finished.");
} finally {
  await client.close();
}
