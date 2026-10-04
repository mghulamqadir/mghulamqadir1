import "dotenv/config";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

const { MONGODB_URI, MONGODB_DB_NAME = "portfolio", BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !BOOTSTRAP_ADMIN_EMAIL || !BOOTSTRAP_ADMIN_PASSWORD) throw new Error("MONGODB_URI, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD are required.");
if (BOOTSTRAP_ADMIN_PASSWORD.length < 12) throw new Error("BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters.");

const client = new MongoClient(MONGODB_URI);
await client.connect();
try {
  const profiles = client.db(MONGODB_DB_NAME).collection("profiles");
  const email = BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase();
  const now = new Date().toISOString();
  const existing = await profiles.findOne({ email });
  await profiles.updateOne(
    { email },
    { $set: { email, password_hash: await bcrypt.hash(BOOTSTRAP_ADMIN_PASSWORD, 12), role: "admin", updated_at: now }, $setOnInsert: { id: randomUUID(), created_at: now } },
    { upsert: true },
  );
  console.log(`${existing ? "Updated" : "Created"} admin ${email}.`);
} finally { await client.close(); }
