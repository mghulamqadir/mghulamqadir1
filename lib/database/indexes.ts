import { getDb } from "@/lib/database/mongodb";

export async function ensureIndexes() {
  const db = await getDb();
  await Promise.all([
    db.collection("profiles").createIndex({ email: 1 }, { unique: true, sparse: true }),
    db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ status: 1, featured: 1, sort_order: 1 }),
    db.collection("technologies").createIndex({ name: 1 }, { unique: true }),
    db.collection("project_technologies").createIndex({ project_id: 1, technology_id: 1 }, { unique: true }),
    db.collection("project_images").createIndex({ project_id: 1, sort_order: 1 }),
    db.collection("experience_highlights").createIndex({ experience_id: 1, sort_order: 1 }),
    db.collection("contact_submissions").createIndex({ status: 1, created_at: -1 }),
    db.collection("audit_logs").createIndex({ created_at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 }),
    db.collection("audit_logs").createIndex({ entity: 1, entity_id: 1, created_at: -1 }),
    db.collection("site_settings").createIndex({ key: 1 }, { unique: true }),
  ]);
}
