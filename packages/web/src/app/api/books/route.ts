import { books, authors, db } from "@book-manager/database";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBooks = await db
      .select()
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id));
    return NextResponse.json(allBooks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
