"use server";

import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { bookSchema } from "./bookSchema";

export async function createAuthorAction(name: string) {
  const [newAuthor] = await db.insert(authors).values({ name }).returning();
  revalidatePath("/books");

  return newAuthor;
}

export async function createBookAction(input: unknown) {
  await db.insert(books).values(bookSchema.parse(input));

  revalidatePath("/books");
}

export async function updateBookAction(input: unknown) {
  const { id, ...data } = bookSchema
    .extend({ id: z.coerce.number().int().positive() })
    .parse(input);

  await db.update(books).set(data).where(eq(books.id, id));

  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await db.delete(books).where(eq(books.id, bookID));

  revalidatePath("/books");
}
