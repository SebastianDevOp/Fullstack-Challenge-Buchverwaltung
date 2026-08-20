import { fetchAuthors, fetchBooks } from "@/lib/booksApi";
import { BooksClientView } from "./BooksClientView";
import { paramsSchema } from "./paramsSchema";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = paramsSchema.parse(await searchParams);
  const pageSize = 20;

  // Die zweite Bücherabfrage liefert die Titel, gegen die das Karussell filtert.
  const [paginatedBooksData, allAuthors, allBooksForFilter] = await Promise.all([
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
      ownedTitles={allBooksForFilter.data.map((book) => book.title)}
    />
  );
}
