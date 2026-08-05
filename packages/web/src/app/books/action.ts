"use server";

import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Book } from "@/types/models";

export async function createAuthorAction(name: string) {
  const [newAuthor] = await db.insert(authors).values({ name }).returning();
  revalidatePath("/books");

  return newAuthor;
}

export async function createBookAction(newBook: Book) {
  const { id, ...bookDataToInsert } = newBook;
  // Leere ISBN muss NULL sein: der UNIQUE-Constraint erlaubt beliebig viele
  // NULL-Werte, aber nur einen einzigen leeren String.
  await db.insert(books).values({ ...bookDataToInsert, isbn: bookDataToInsert.isbn || null });

  revalidatePath("/books");
}

export async function updateBookAction(updatedBook: Book) {
  await db
    .update(books)
    .set({ ...updatedBook, isbn: updatedBook.isbn || null })
    .where(eq(books.id, updatedBook.id));

  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await db.delete(books).where(eq(books.id, bookID));

  revalidatePath("/books");
}
