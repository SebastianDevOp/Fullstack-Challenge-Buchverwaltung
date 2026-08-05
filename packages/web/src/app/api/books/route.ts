import { authors, books, db } from "@book-manager/database";
import { and, count, eq, ilike, type SQL } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// --- ZOD-SCHEMA ---
const apiSchema = z.object({
  title: z.string().min(1),
  authorId: z.coerce.number().positive(),
  isbn: z.coerce.string().optional(),
  year: z.coerce.number().optional(),
});

const urlSchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().max(100).default(20),
  authorId: z.coerce.number().optional(),
});

// --- HILFSFUNKTIONEN ---
const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unbekannter Fehler";
  return NextResponse.json({ error: message }, { status: 500 });
};

// --- API-ENDPUNKTE ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const result = urlSchema.safeParse({
    q: searchParams.get("q") || undefined,
    page: searchParams.get("page") || undefined,
    pageSize: searchParams.get("pageSize") || undefined,
    authorId: searchParams.get("authorId") || undefined,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { q, pageSize, page, authorId } = result.data;

  try {
    const conditions: SQL[] = [];

    if (q) {
      conditions.push(ilike(books.title, `%${q}%`));
    }
    if (authorId) {
      conditions.push(eq(books.authorId, authorId));
    }

    const paginatedBooks = await db
      .select()
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id))
      .where(and(...conditions))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [totalCount] = await db
      .select({ count: count() })
      .from(books)
      .where(and(...conditions));

    return NextResponse.json({
      data: paginatedBooks,
      page: page,
      pageSize: pageSize,
      total: totalCount?.count ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = apiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }
    const [insertBook] = await db.insert(books).values(result.data).returning();

    return NextResponse.json(insertBook, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
