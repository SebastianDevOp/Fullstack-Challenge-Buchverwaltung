"use server";

import { books, db, findOrCreateAuthor } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { bookSchema } from "./bookSchema";

const authorNameSchema = z.string().trim().min(1);

export async function createAuthorAction(name: unknown) {
  const author = await findOrCreateAuthor(db, authorNameSchema.parse(name));
  revalidatePath("/books");

  return author;
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
