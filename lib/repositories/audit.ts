import { randomUUID } from "crypto";
import { collection } from "@/lib/database/mongodb";

export async function audit(userId: string, action: string, entity: string, entityId?: string) {
  return collection("audit_logs").then((items) => items.insertOne({ id: randomUUID(), user_id: userId, action, entity, ...(entityId ? { entity_id: entityId } : {}), metadata: {}, created_at: new Date().toISOString() }));
}
