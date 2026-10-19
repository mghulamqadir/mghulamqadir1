import "dotenv/config";
import { MongoClient } from "mongodb";
import { integerEnv, mongoScriptEnv } from "./env-contract.mjs";

const { uri, dbName } = mongoScriptEnv();
const retentionDays = integerEnv("REQUEST_LOG_RETENTION_DAYS", 90, 1, 3650);

const client = new MongoClient(uri);
await client.connect();

async function migrateCollection(name, expireAfterSeconds) {
  const db = client.db(dbName);
  const collection = db.collection(name);
  const [stringCount, malformedRows] = await Promise.all([
    collection.countDocuments({ created_at: { $type: "string" } }),
    collection.aggregate([
      { $match: { created_at: { $type: "string" } } },
      { $project: { converted: { $convert: { input: "$created_at", to: "date", onError: null, onNull: null } } } },
      { $match: { converted: null } },
      { $count: "count" },
    ]).toArray(),
  ]);
  const malformedCount = malformedRows[0]?.count || 0;

  if (stringCount) {
    await collection.updateMany(
      { created_at: { $type: "string" } },
      [{ $set: { created_at: { $convert: { input: "$created_at", to: "date", onError: new Date(0), onNull: new Date(0) } } } }],
    );
  }

  const cutoff = new Date(Date.now() - expireAfterSeconds * 1000);
  const deleted = await collection.deleteMany({ created_at: { $lt: cutoff } });
  const indexes = await collection.indexes();
  const ttlIndex = indexes.find((index) => index.key?.created_at === 1 && Object.keys(index.key).length === 1);
  if (ttlIndex) {
    await db.command({ collMod: name, index: { name: ttlIndex.name, expireAfterSeconds } });
  } else {
    await collection.createIndex({ created_at: 1 }, { expireAfterSeconds });
  }

  console.log(`${name}: converted ${stringCount} timestamp(s), found ${malformedCount} malformed timestamp(s), removed ${deleted.deletedCount} expired record(s).`);
}

try {
  await migrateCollection("request_logs", retentionDays * 86_400);
  await migrateCollection("audit_logs", 365 * 86_400);
  console.log("Log timestamp migration completed.");
} finally {
  await client.close();
}
