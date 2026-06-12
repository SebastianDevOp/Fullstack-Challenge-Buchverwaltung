import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { error } from "node:console";
import { z } from "zod";

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

const schema = z.object({
  titel: z.string().min(1),
  authorId: z.number().positive(),
  isbn: z.string().optional(),
  year: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten }, { status: 400 });
    }

    const { title, authorId, isbn, year } = body;

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
