import { eq, sql } from "drizzle-orm";
import type { db } from "./db";
import { type Author, authors } from "./schema";

type Database = typeof db;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type DbHandle = Database | Transaction;

const normalizeName = (value: string) => value.toLowerCase().replace(/[.\s]/g, "");

const normalizedAuthorName = sql`replace(replace(lower(${authors.name}), '.', ''), ' ', '')`;

export async function findOrCreateAuthor(handle: DbHandle, name: string): Promise<Author> {
  const trimmedName = name.trim();

  const [existing] = await handle
    .select()
    .from(authors)
    .where(eq(normalizedAuthorName, normalizeName(trimmedName)))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await handle.insert(authors).values({ name: trimmedName }).returning();

  return created;
}
