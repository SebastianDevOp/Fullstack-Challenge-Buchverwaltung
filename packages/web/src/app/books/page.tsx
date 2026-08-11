import { authors, books, db } from "@book-manager/database";
import { and, count, ilike, type SQL } from "drizzle-orm";
import { BooksClientView } from "./BooksClientView";
import { paramsSchema } from "./paramsSchema";

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
  const [paginatedBooksData, [totalCount], allAuthors] = await Promise.all([
    db
      .select()
      .from(books)
      .where(and(...conditions))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: count() })
      .from(books)
      .where(and(...conditions)),
    db.select().from(authors),
  ]);

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
