"use server";

import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const book = z.object({
  title: z.string().trim().min(1),
  authorId: z.coerce.number().int().positive(),
  isbn: z.string().trim().optional(),
  year: z.coerce.number().int().positive(),
});

export async function createAuthorAction(name: string) {
  const [newAuthor] = await db.insert(authors).values({ name }).returning();
  revalidatePath("/books");

  return newAuthor;
}

export async function createBookAction(input: unknown) {
  await db.insert(books).values(book.parse(input));

  revalidatePath("/books");
}

export async function updateBookAction(input: unknown) {
  const { id, ...data } = book.extend({ id: z.coerce.number().int().positive() }).parse(input);

  await db.update(books).set(data).where(eq(books.id, id));

  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await db.delete(books).where(eq(books.id, bookID));

  revalidatePath("/books");
}
