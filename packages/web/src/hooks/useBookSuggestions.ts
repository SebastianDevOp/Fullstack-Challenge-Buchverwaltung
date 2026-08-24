import { useEffect, useState } from "react";
import type { ApiAuthor } from "@/lib/booksApi";
import { OPEN_LIBRARY_FIELDS, type OpenLibraryResponse } from "@/lib/openLibrary";
import type { OpenLibraryBook } from "./useOpenLibrarySearch";

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
    let cancelled = false;
    if (!authorKey) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const fetchPromise = authorKey.split("|").map((authorName) => {
          const encodedName = encodeURIComponent(authorName);
          const url = `https://openlibrary.org/search.json?author=${encodedName}&limit=10&fields=${OPEN_LIBRARY_FIELDS}`;

          return fetch(url).then((res) => {
            if (!res.ok) {
              throw new Error(`Suche nach "${authorName}" fehlgeschlagen (HTTP ${res.status})`);
            }
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
              coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            };
            formattedResults.push(book);
          }
        }
        const slicedFormattedResult = formattedResults.slice(0, 12);

        if (!cancelled) setSuggestions(slicedFormattedResult);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Ein unbekannter Fehler ist aufgetreten");
        }
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [authorKey, ownedKey]);

  function removeSuggestion(key: string) {
    setSuggestions((prev) => prev.filter((suggestion) => suggestion.key !== key));
  }

  return { suggestions, isLoading, removeSuggestion };
}
