import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  console.error("Error: MONGO_URI or MONGODB_URI is required.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function cleanupDuplicateProjects() {
  await client.connect();
  const db = client.db(dbName);

  console.log("Analyzing projects for duplicate slugs...");
  const projects = await db.collection("projects").find({}).toArray();

  const bySlug = new Map();
  for (const p of projects) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
    bySlug.get(p.slug).push(p);
  }

  let removedCount = 0;

  for (const [slug, docs] of bySlug.entries()) {
    if (docs.length > 1) {
      console.log(`\nFound ${docs.length} records for slug "${slug}":`);
      // Sort so the most recently updated or newest record is kept
      docs.sort((a, b) => {
        const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
        const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
        return timeB - timeA;
      });

      const toKeep = docs[0];
      const toRemove = docs.slice(1);

      console.log(`  -> Keeping ID ${toKeep.id} (updated: ${toKeep.updated_at || toKeep.created_at})`);

      for (const rem of toRemove) {
        console.log(`  -> Removing duplicate ID ${rem.id}`);
        await db.collection("projects").deleteOne({ id: rem.id });
        await db.collection("project_technologies").deleteMany({ project_id: rem.id });
        await db.collection("project_images").deleteMany({ project_id: rem.id });
        removedCount++;
      }
    }
  }

  // Normalize sort_order sequentially
  const remaining = await db.collection("projects").find({}).sort({ sort_order: 1, created_at: 1 }).toArray();
  for (let i = 0; i < remaining.length; i++) {
    const p = remaining[i];
    const newOrder = i + 1;
    if (p.sort_order !== newOrder) {
      await db.collection("projects").updateOne({ id: p.id }, { $set: { sort_order: newOrder } });
    }
  }

  console.log(`\nCleanup complete. Removed ${removedCount} duplicate projects.`);
  console.log(`Remaining unique projects: ${remaining.length}`);
  await client.close();
}

cleanupDuplicateProjects().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
