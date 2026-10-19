import { getDb } from "@/lib/database/mongodb";
import { env } from "@/lib/env";

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
    db.collection("audit_logs").createIndex({ entity: 1, entity_id: 1, created_at: -1 }),
    db.collection("request_logs").createIndex({ created_at: -1 }),
    db.collection("request_logs").createIndex({ ip: 1, created_at: -1 }),
    db.collection("request_logs").createIndex({ path: 1, created_at: -1 }),
    db.collection("request_logs").createIndex({ id: 1 }, { unique: true }),
    db.collection("site_settings").createIndex({ key: 1 }, { unique: true }),
  ]);
  await Promise.all([
    ensureTtlIndex(db, "audit_logs", 365 * 86_400),
    ensureTtlIndex(db, "request_logs", env.REQUEST_LOG_RETENTION_DAYS * 86_400),
  ]);
}

async function ensureTtlIndex(db: Awaited<ReturnType<typeof getDb>>, name: string, expireAfterSeconds: number) {
  const col = db.collection(name);
  const existing = (await col.indexes()).find((index) => index.key?.created_at === 1 && Object.keys(index.key).length === 1);
  if (existing) {
    await db.command({ collMod: name, index: { name: existing.name, expireAfterSeconds } });
    return;
  }
  await col.createIndex({ created_at: 1 }, { expireAfterSeconds });
}
