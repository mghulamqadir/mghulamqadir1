import "dotenv/config";
import { MongoClient } from "mongodb";

const { MONGO_URI, MONGODB_DB_NAME = "portfolio" } = process.env;
if (!MONGO_URI) throw new Error("MONGO_URI is required.");
const client = new MongoClient(MONGO_URI);
await client.connect();
try {
  const db = client.db(MONGODB_DB_NAME);
  await Promise.all([
    db.collection("profiles").createIndex({ email: 1 }, { unique: true, sparse: true }),
    db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ status: 1, featured: 1, sort_order: 1 }),
    db.collection("technologies").createIndex({ name: 1 }, { unique: true }),
    db.collection("project_technologies").createIndex({ project_id: 1, technology_id: 1 }, { unique: true }),
    db.collection("project_images").createIndex({ project_id: 1, sort_order: 1 }),
    db.collection("experience_highlights").createIndex({ experience_id: 1, sort_order: 1 }),
    db.collection("experiences").createIndex({ sort_order: 1 }),
    db.collection("testimonials").createIndex({ sort_order: 1 }),
    db.collection("skills").createIndex({ sort_order: 1 }),
    db.collection("education").createIndex({ sort_order: 1 }),
    db.collection("certifications").createIndex({ sort_order: 1 }),
    db.collection("social_links").createIndex({ sort_order: 1 }),
    db.collection("contact_submissions").createIndex({ status: 1, created_at: -1 }),
    db.collection("audit_logs").createIndex({ created_at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 }),
    db.collection("audit_logs").createIndex({ created_at: -1 }),
    db.collection("audit_logs").createIndex({ user_id: 1 }),
    db.collection("audit_logs").createIndex({ entity: 1, entity_id: 1, created_at: -1 }),
    db.collection("site_settings").createIndex({ key: 1 }, { unique: true }),
  ]);
  console.log("MongoDB indexes are ready.");
} finally { await client.close(); }
