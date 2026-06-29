"use server";

import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Book } from "@/types/models";

export async function createAuthorActio(name: string) {
  const [newAuthor] = await db.insert(authors).values({ name }).returning();
  revalidatePath("/books");

  return newAuthor;
}

export async function createBookAction(newBook: Book) {
  const { id, ...bookDataToInsert } = newBook;
  await db.insert(books).values(bookDataToInsert);

  revalidatePath("/books");
}

export async function updateBookAction(updatedBook: Book) {
  await db.update(books).set(updatedBook).where(eq(books.id, updatedBook.id));

  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await db.delete(books).where(eq(books.id, bookID));

  revalidatePath("/books");
}
