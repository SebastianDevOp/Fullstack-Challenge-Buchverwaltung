import { books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    console.log(bookId);
    const book = await db.select().from(books).where(eq(books.id, bookId));
    if (!book) {
      return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    const deletedBook = await db.delete(books).where(eq(books.id, bookId));
    if (!deletedBook) {
      return NextResponse.json({ error: "Buch nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

const schema = z.object({
  title: z.string().optional(),
  authorId: z.coerce.number().optional(),
  isbn: z.string().optional(),
  year: z.number().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const bookId = Number(resolvedParams.id);
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, authorId, isbn, year } = result.data;

    const updatedBook = await db
      .update(books)
      .set({
        title: title,
        authorId: authorId,
        isbn: isbn,
        year: year,
      })
      .where(eq(books.id, bookId))
      .returning();
    if (!updatedBook) {
      return NextResponse.json({ error: "Buch nicht verhanden" }, { status: 404 });
    }

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
