import { books, authors, db, NewBook } from "@book-manager/database";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBooks = await db
      .select()
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id));
    return NextResponse.json(allBooks);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authorId, isbn, year } = body;

    if (!title || !authorId) {
      return NextResponse.json(
        {
          error: "'title' und 'authorId' sind Pflichtfelder",
        },
        { status: 400 },
      );
    }
    const [insertBook] = await db
      .insert(books)
      .values({
        title,
        authorId,
        isbn: isbn || null,
        year: year || null,
      })
      .returning();

    return NextResponse.json(insertBook, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
