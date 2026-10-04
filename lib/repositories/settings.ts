import { collection } from "@/lib/database/mongodb";
import { type RecordWithId, withoutMongoId } from "@/lib/database/documents";

export async function getSettings(keys: string[]) { const rows = await collection<{ key: string; value: Record<string, unknown> }>("site_settings").then((items) => items.find({ key: { $in: keys } }).toArray()); return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, Record<string, unknown>>; }
export async function getProfile(id: string) { return withoutMongoId(await collection<RecordWithId>("profiles").then((items) => items.findOne({ id }))); }
export async function saveSettings(profileId: string, profile: Record<string, unknown>, settings: Record<string, Record<string, unknown>>) {
  const now = new Date().toISOString();
  await collection("profiles").then((items) => items.updateOne({ id: profileId }, { $set: { ...profile, role: "admin", updated_at: now }, $setOnInsert: { id: profileId, created_at: now } }, { upsert: true }));
  await Promise.all(Object.entries(settings).map(([key, value]) => collection("site_settings").then((items) => items.updateOne({ key }, { $set: { value, updated_at: now }, $setOnInsert: { key } }, { upsert: true }))));
}
