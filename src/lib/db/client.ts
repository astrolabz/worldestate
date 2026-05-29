import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  const sqlClient = postgres(connectionString, { prepare: false });
  cachedDb = drizzle(sqlClient);

  return cachedDb;
}
