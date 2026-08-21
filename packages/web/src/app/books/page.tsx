import { fetchAuthors, fetchBooks, fetchBookTitles } from "@/lib/booksApi";
import { BooksClientView } from "./BooksClientView";
import { paramsSchema } from "./paramsSchema";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = paramsSchema.parse(await searchParams);
  const pageSize = 20;

  const [paginatedBooksData, allAuthors, ownedTitles] = await Promise.all([
    fetchBooks({ q, page, size: pageSize }),
    fetchAuthors(),
    fetchBookTitles(),
  ]);

  return (
    <BooksClientView
      initialBooks={paginatedBooksData.data}
      authors={allAuthors}
      totalCount={paginatedBooksData.total}
      currentPage={page}
      q={q}
      pageSize={pageSize}
      ownedTitles={ownedTitles}
    />
  );
}
