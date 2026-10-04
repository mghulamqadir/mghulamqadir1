import type { Db, Document } from "mongodb";
import mongoose, { type Mongoose } from "mongoose";
import { env, hasMongo } from "@/lib/env";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

declare global {
  var mongooseConnectionPromise: Promise<Mongoose> | undefined;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(): Promise<Mongoose> {
  if (!hasMongo()) throw new Error("Missing MONGODB_URI (or MONGO_URI) environment variable.");
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const connection = await mongoose.connect(env.MONGODB_URI!, {
        dbName: env.MONGODB_DB_NAME,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 60_000,
        waitQueueTimeoutMS: 5_000,
        socketTimeoutMS: 10_000,
        serverSelectionTimeoutMS: 5_000,
      });
      console.info("MongoDB connected", { host: connection.connection.host, database: env.MONGODB_DB_NAME });
      return connection;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed`, { message: error instanceof Error ? error.message : "unknown" });
      if (attempt < MAX_RETRIES) await wait(RETRY_DELAY_MS);
    }
  }

  throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts.`, { cause: lastError });
}

export async function connectDatabase(): Promise<void> {
  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = connectWithRetry().catch((error: unknown) => {
      global.mongooseConnectionPromise = undefined;
      throw error;
    });
  }
  await global.mongooseConnectionPromise;
}

export async function getDb(): Promise<Db> {
  await connectDatabase();
  if (!mongoose.connection.db) throw new Error("MongoDB connected without an available database handle.");
  return mongoose.connection.db as unknown as Db;
}

export async function collection<T extends Document = Document>(name: string) {
  return (await getDb()).collection<T>(name);
}
