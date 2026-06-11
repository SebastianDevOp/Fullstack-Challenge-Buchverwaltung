import { books, db } from "@book-manager/database";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const bookId = Number(params.id);
    const [book] = await db.select().from(books).where(eq(books.id, bookId));
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
