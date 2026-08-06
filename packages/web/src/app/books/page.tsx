import { authors, books, db } from "@book-manager/database";
import { and, count, ilike, type SQL } from "drizzle-orm";
import z from "zod";
import { BooksClientView } from "./BooksClientView";

// --- ZOD-SCHEMA ----

const paramsSchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().int().positive().max(999).catch(1),
});

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const parsedSearchParams = paramsSchema.parse(resolvedSearchParams);
  const q = parsedSearchParams.q;
  const page = Math.max(parsedSearchParams.page, 1);
  const pageSize = 20;

  const conditions: SQL[] = [];
  if (q) {
    conditions.push(ilike(books.title, `%${q}%`));
  }
  const paginatedBooksData = await db
    .select()
    .from(books)
    .where(and(...conditions))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [totalCount] = await db
    .select({ count: count() })
    .from(books)
    .where(and(...conditions));

  const allAuthors = await db.select().from(authors);

  return (
    <BooksClientView
      initialBooks={paginatedBooksData}
      authors={allAuthors}
      totalCount={totalCount?.count ?? 0}
      currentPage={page}
      q={q}
      pageSize={pageSize}
    />
  );
}
