import type { Document } from "mongodb";

export type RecordWithId = Document & { id: string; created_at?: string | Date; updated_at?: string | Date };

export function withoutMongoId<T extends Document>(value: T | null): T | null {
  if (!value) return null;
  const record = { ...value };
  delete record._id;
  return record as T;
}
