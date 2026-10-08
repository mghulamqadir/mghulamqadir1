import "dotenv/config";
import { MongoClient } from "mongodb";

const { MONGO_URI, MONGODB_DB_NAME = "portfolio" } = process.env;
if (!MONGO_URI) throw new Error("MONGO_URI is required.");
const client = new MongoClient(MONGO_URI);
await client.connect();

try {
  const db = client.db(MONGODB_DB_NAME);

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
    { coll: "request_logs", spec: { ip: 1 } },
    { coll: "request_logs", spec: { path: 1 } },
    { coll: "request_logs", spec: { created_at: 1 }, options: { expireAfterSeconds: 60 * 60 * 24 * 90 } },
    { coll: "site_settings", spec: { key: 1 }, options: { unique: true } },
  ];

  for (const { coll, spec, options } of indexDefinitions) {
    try {
      await db.collection(coll).createIndex(spec, options || {});
      console.log(`✓ Index created on ${coll}:`, JSON.stringify(spec));
    } catch (err) {
      console.warn(`! Skipped index on ${coll} (${JSON.stringify(spec)}):`, err instanceof Error ? err.message : String(err));
    }
  }

  console.log("\nMongoDB index creation finished.");
} finally {
  await client.close();
}
