import { useEffect, useState } from "react";
import type { ApiAuthor } from "@/lib/booksApi";
import type { OpenLibraryBook } from "./useOpenLibrarySearch";

type BookSuggestionsDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
};

type OpenLibraryResponse = {
  docs: BookSuggestionsDoc[];
};
const normalizeTitle = (value: string) => value.trim().toLowerCase();

export function useBookSuggestions(authors: ApiAuthor[], ownedTitles: string[]) {
  const [suggestions, setSuggestions] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [seed] = useState(() => Math.random());

  const start = authors.length > 0 ? Math.floor(seed * authors.length) : 0;
  const authorKey = Array.from(
    { length: Math.min(3, authors.length) },
    (_, index) => authors[(start + index) % authors.length].name,
  ).join("|");
  const ownedKey = ownedTitles.map(normalizeTitle).join("|");

  useEffect(() => {
    const load = async () => {
      try {
        const fetchPromise = authorKey.split("|").map((authorName) => {
          const encodedName = encodeURIComponent(authorName);
          const url = `https://openlibrary.org/search.json?author=${encodedName}&limit=10&fields=key,title,author_name,first_publish_year,isbn,cover_i`;

          return fetch(url).then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          });
        });
        const result: OpenLibraryResponse[] = await Promise.all(fetchPromise);

        const formattedResults: OpenLibraryBook[] = [];
        const seen = new Set<string>();
        const ownedSet = new Set<string>(ownedKey.split("|"));

        for (const response of result) {
          for (const doc of response.docs) {
            if (!doc.cover_i) continue;
            if (seen.has(doc.key)) continue;
            seen.add(doc.key);

            if (ownedSet.has(normalizeTitle(doc.title))) continue;

            const book: OpenLibraryBook = {
              key: doc.key,
              title: doc.title,
              authorName: doc.author_name?.[0],
              year: doc.first_publish_year,
              isbn: doc.isbn?.[0],
              coverUrl: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : undefined,
            };
            formattedResults.push(book);
          }
        }
        const slicedFormattedResult = formattedResults.slice(0, 12);

        setSuggestions(slicedFormattedResult);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Ein unbekannter Fehler ist aufgetreten");
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [authorKey, ownedKey]);

  function removeSuggestion(key: string) {
    setSuggestions((prev) => prev.filter((suggestion) => suggestion.key !== key));
  }

  return { suggestions, isLoading, removeSuggestion };
}
