import { randomUUID } from "crypto";
import { collection } from "@/lib/database/mongodb";
import { type RecordWithId, withoutMongoId } from "@/lib/database/documents";

export type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; status: string; email_status: string; brevo_message_id?: string | null; created_at: string };

export async function countCollection(name: string, filter: Record<string, unknown> = {}) { return collection(name).then((items) => items.countDocuments(filter)); }
export async function listMessages() { return collection<RecordWithId>("contact_submissions").then((items) => items.find({}).sort({ created_at: -1 }).toArray()).then((rows) => rows.map(withoutMongoId) as unknown as ContactMessage[]); }
export async function updateMessage(id: string, value: Record<string, unknown>) { return collection("contact_submissions").then((items) => items.updateOne({ id }, { $set: value })); }
export async function deleteMessage(id: string) { return collection("contact_submissions").then((items) => items.deleteOne({ id })); }
export async function insertMessage(value: Record<string, unknown>) { const id = randomUUID(); await collection("contact_submissions").then((items) => items.insertOne({ ...value, id, status: "unread", email_status: "pending", created_at: new Date().toISOString() })); return id; }
