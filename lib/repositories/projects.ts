import { randomUUID } from "crypto";
import { collection, getDb } from "@/lib/database/mongodb";
import { type RecordWithId, withoutMongoId } from "@/lib/database/documents";
import type { Project, ProjectImage, Technology } from "@/lib/types";

export async function listProjects(status?: "published") {
  const query = status ? { status } : {};
  return (await collection<RecordWithId>("projects")).find(query).sort({ sort_order: 1 }).toArray().then((rows) => rows.map(withoutMongoId) as unknown as Project[]);
}

async function hydrateProjects(rows: Project[]) {
  if (!rows.length) return rows;
  const ids = rows.map((project) => project.id);
  const [links, images] = await Promise.all([
    collection<{ project_id: string; technology_id: string }>("project_technologies").then((items) => items.find({ project_id: { $in: ids } }).toArray()),
    collection<RecordWithId>("project_images").then((items) => items.find({ project_id: { $in: ids } }).sort({ sort_order: 1 }).toArray()),
  ]);
  const technologyIds = [...new Set(links.map((link) => link.technology_id))];
  const technologies = technologyIds.length ? await collection<RecordWithId>("technologies").then((items) => items.find({ id: { $in: technologyIds } }).toArray()) : [];
  const technologyById = new Map(technologies.map((item) => [item.id, withoutMongoId(item) as unknown as Technology]));
  return rows.map((project) => ({
    ...project,
    technologies: links.filter((link) => link.project_id === project.id).flatMap((link) => { const technology = technologyById.get(link.technology_id); return technology ? [technology] : []; }),
    images: images.filter((image) => image.project_id === project.id).map((image) => withoutMongoId(image) as unknown as ProjectImage),
  }));
}

export async function getPublishedProjects() { return hydrateProjects(await listProjects("published")); }
export async function getPublishedProject(slug: string) {
  const row = withoutMongoId(await collection<RecordWithId>("projects").then((items) => items.findOne({ slug, status: "published" }))) as unknown as Project | null;
  return row ? (await hydrateProjects([row]))[0] : null;
}
export async function createProject(value: Record<string, unknown>) {
  const { technology_ids, gallery_images, ...projectValue } = value;
  const now = new Date().toISOString(); 
  const record = { ...projectValue, id: randomUUID(), created_at: now, updated_at: now } as RecordWithId;
  await collection<RecordWithId>("projects").then((items) => items.insertOne(record)); 
  const db = await getDb();
  if (Array.isArray(technology_ids) && technology_ids.length > 0) {
    await db.collection("project_technologies").insertMany(technology_ids.map((tid: string) => ({ project_id: record.id, technology_id: tid })));
  }
  if (Array.isArray(gallery_images) && gallery_images.length > 0) {
    await db.collection("project_images").insertMany(gallery_images.map((img: any, i: number) => ({ ...img, id: randomUUID(), project_id: record.id, sort_order: i })));
  }
  return record;
}
export async function findProject(id: string) { return withoutMongoId(await collection<RecordWithId>("projects").then((items) => items.findOne({ id }))) as unknown as Project | null; }
export async function updateProject(id: string, value: Record<string, unknown>) { 
  const { technology_ids, gallery_images, ...projectValue } = value;
  await collection<RecordWithId>("projects").then((items) => items.updateOne({ id }, { $set: { ...projectValue, updated_at: new Date().toISOString() } })); 
  const db = await getDb();
  if (technology_ids !== undefined) {
    await db.collection("project_technologies").deleteMany({ project_id: id });
    if (Array.isArray(technology_ids) && technology_ids.length > 0) {
      await db.collection("project_technologies").insertMany(technology_ids.map((tid: string) => ({ project_id: id, technology_id: tid })));
    }
  }
  if (gallery_images !== undefined) {
    await db.collection("project_images").deleteMany({ project_id: id });
    if (Array.isArray(gallery_images) && gallery_images.length > 0) {
      await db.collection("project_images").insertMany(gallery_images.map((img: any, i: number) => ({ ...img, id: randomUUID(), project_id: id, sort_order: i })));
    }
  }
  return findProject(id); 
}
export async function deleteProject(id: string) {
  const db = await getDb();
  // Ordered deletion prevents an orphaned relation when the primary delete succeeds first.
  await db.collection("project_technologies").deleteMany({ project_id: id });
  await db.collection("project_images").deleteMany({ project_id: id });
  await db.collection("projects").deleteOne({ id });
}
