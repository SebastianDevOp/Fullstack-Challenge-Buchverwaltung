import { books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// --- ZOD-SCHEMA---
const apiSchema = z.object({
  title: z.string().optional(),
  authorId: z.coerce.number().optional(),
  isbn: z.coerce.string().optional(),
  year: z.coerce.number().optional(),
});

// --- HILFSFUNKTION ---
const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unbekannter Fehler";
  return NextResponse.json({ error: message }, { status: 500 });
};

// --- API-ENDPUNKTE ---
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    const book = await db.select().from(books).where(eq(books.id, bookId));
    if (book.length === 0) {
      return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    const deletedBook = await db.delete(books).where(eq(books.id, bookId)).returning();
    if (deletedBook.length === 0) {
      return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    const body = await request.json();
    const result = apiSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const updatedBook = await db
      .update(books)
      .set(result.data)
      .where(eq(books.id, bookId))
      .returning();
    if (updatedBook.length === 0) {
      return NextResponse.json({ error: "Buch nicht vorhanden" }, { status: 404 });
    }

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
