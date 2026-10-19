import "dotenv/config";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";
import { mongoScriptEnv, requireEnv } from "./env-contract.mjs";

const { uri, dbName } = mongoScriptEnv();
const BOOTSTRAP_ADMIN_EMAIL = requireEnv("BOOTSTRAP_ADMIN_EMAIL");
const BOOTSTRAP_ADMIN_PASSWORD = requireEnv("BOOTSTRAP_ADMIN_PASSWORD");
if (BOOTSTRAP_ADMIN_PASSWORD.length < 12) throw new Error("BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters.");

const client = new MongoClient(uri);
await client.connect();
try {
  const profiles = client.db(dbName).collection("profiles");
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
