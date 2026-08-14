import { authors, db } from "@book-manager/database";
import { fetchBooks } from "@/lib/booksApi";
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

  const paginatedBooksData = await fetchBooks({ q: q, page: page, size: pageSize });

  const allAuthors = await db.select().from(authors);

  return (
    <BooksClientView
      initialBooks={paginatedBooksData.data}
      authors={allAuthors}
      totalCount={paginatedBooksData.total}
      currentPage={page}
      q={q}
      pageSize={pageSize}
    />
  );
}
