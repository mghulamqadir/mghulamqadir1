import { randomUUID } from "crypto";
import type { ContentResource } from "@/lib/content/content-config";
import { collection } from "@/lib/database/mongodb";
import { type RecordWithId, withoutMongoId } from "@/lib/database/documents";
import type { Experience, Technology, Testimonial } from "@/lib/types";

const timestamped = new Set(["projects", "technologies", "testimonials", "experiences", "skills", "education", "certifications"]);

export async function getExperiences() {
  const rows = await collection<RecordWithId>("experiences").then((items) => items.find({}).sort({ sort_order: 1 }).toArray());
  const ids = rows.map((row) => row.id);
  const highlights = ids.length ? await collection<{ experience_id: string; content: string }>("experience_highlights").then((items) => items.find({ experience_id: { $in: ids } }).sort({ sort_order: 1 }).toArray()) : [];
  return rows.map((row) => ({ ...(withoutMongoId(row) as unknown as Experience), highlights: highlights.filter((item) => item.experience_id === row.id).map((item) => item.content) }));
}
export async function getTestimonials() { return collection<RecordWithId>("testimonials").then((items) => items.find({ status: "published", featured: true }).sort({ sort_order: 1 }).limit(3).toArray()).then((rows) => rows.map(withoutMongoId) as unknown as Testimonial[]); }
export async function getTechnologies() { return collection<RecordWithId>("technologies").then((items) => items.find({}).sort({ category: 1, sort_order: 1 }).toArray()).then((rows) => rows.map(withoutMongoId) as unknown as Technology[]); }

export async function listResource(resource: ContentResource) {
  return collection<RecordWithId>(resource).then((items) => items.find({}).sort({ sort_order: 1 }).toArray()).then((rows) => rows.map(withoutMongoId) as Record<string, unknown>[]);
}
export async function createResource(resource: ContentResource, value: Record<string, unknown>) {
  const now = new Date().toISOString();
  const record = { ...value, id: randomUUID(), ...(timestamped.has(resource) ? { created_at: now, updated_at: now } : {}) } as RecordWithId;
  await collection<RecordWithId>(resource).then((items) => items.insertOne(record));
  return record;
}
export async function updateResource(resource: ContentResource, id: string, value: Record<string, unknown>) {
  const update = { ...value, ...(timestamped.has(resource) ? { updated_at: new Date().toISOString() } : {}) };
  await collection<RecordWithId>(resource).then((items) => items.updateOne({ id }, { $set: update }));
  return withoutMongoId(await collection<RecordWithId>(resource).then((items) => items.findOne({ id })));
}
export async function deleteResource(resource: ContentResource, id: string) { return collection<RecordWithId>(resource).then((items) => items.deleteOne({ id })); }
