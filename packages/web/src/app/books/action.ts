"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import {
  ApiError,
  AUTHORS_TAG,
  BOOKS_TAG,
  createAuthor,
  createBook,
  deleteBook,
  updateBook,
} from "@/lib/booksApi";
import { bookSchema } from "./bookSchema";

const authorNameSchema = z.string().trim().min(1);

export async function createAuthorAction(name: unknown) {
  const author = await createAuthor(authorNameSchema.parse(name));
  updateTag(AUTHORS_TAG);
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

  updateTag(BOOKS_TAG);
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

  updateTag(BOOKS_TAG);
  revalidatePath("/books");
}

export async function deleteBookAction(bookID: number) {
  await deleteBook(bookID);
  updateTag(BOOKS_TAG);
  revalidatePath("/books");
}
