"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiError, createAuthor, createBook, deleteBook, updateBook } from "@/lib/booksApi";
import { bookSchema } from "./bookSchema";

const authorNameSchema = z.string().trim().min(1);

export async function createAuthorAction(name: unknown) {
  const author = await createAuthor(authorNameSchema.parse(name));
  revalidatePath("/books");

  return author;
}

export async function createBookAction(input: unknown) {
  try {
    await createBook(bookSchema.parse(input));
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { error: "duplicate-isbn" };
    }

    throw error;
  }

  revalidatePath("/books");
}

export async function updateBookAction(input: unknown) {
  const { id, ...data } = bookSchema
    .extend({ id: z.coerce.number().int().positive() })
    .parse(input);

  try {
    await updateBook(id, data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { error: "duplicate-isbn" };
    }
    throw error;
  }

  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await deleteBook(bookID);
  revalidatePath("/books");
}
