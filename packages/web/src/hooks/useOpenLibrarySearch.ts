import { useEffect, useState } from "react";

export type OpenLibraryBook = {
  key: string;
  title: string;
  authorName?: string;
  isbn?: number;
  year?: number;
  coverUrl?: string;
};

type OpenLibraryBookDoc = {
  key: string;
  title: string;
  author_name?: string;
  first_publish_year?: number;
  isbn?: string;
  cover_i?: number;
};

export function useOpenLibrarySearch(query: string) {
  const [results, setResult] = useState<OpenLibraryBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResult([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(
            query,
          )}&limit=5&fields=title,author_name,first_publish_year,isbn`,
        );
        const data = await response.json();

        const formattedResults = data.docs.map((doc: OpenLibraryBookDoc) => ({
          key: doc.key,
          title: doc.title,
          authorName: doc.author_name?.[0],
          year: doc.first_publish_year,
          isbn: doc.isbn?.[0],
          coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : undefined,
        }));
        setResult(formattedResults);
      } catch (error) {
        console.error("Fehler der der OpenLibrary Suche", error);
        setResult([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);
  return { results, isSearching };
}
