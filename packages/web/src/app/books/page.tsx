import { fetchAuthors, fetchBooks } from "@/lib/booksApi";
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

  const [paginatedBooksData, allAuthors, allBooks] = await Promise.all([
    fetchBooks({ q, page, size: pageSize }),
    fetchAuthors(),
    fetchBooks({ size: 200 }),
  ]);

  return (
    <BooksClientView
      initialBooks={paginatedBooksData.data}
      authors={allAuthors}
      totalCount={paginatedBooksData.total}
      currentPage={page}
      q={q}
      pageSize={pageSize}
      ownedTitles={allBooks.data.map((book) => book.title)}
    />
  );
}
