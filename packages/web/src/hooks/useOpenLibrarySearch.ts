import { useEffect, useState } from "react";
import {
  OPEN_LIBRARY_FIELDS,
  type OpenLibraryDoc,
  type OpenLibraryResponse,
} from "@/lib/openLibrary";

export type OpenLibraryBook = {
  key: string;
  title: string;
  authorName?: string;
  isbn?: string;
  year?: number;
  coverUrl?: string;
};

/**
 * Hook für die Live-Suche in der OpenLibrary API.
 * Holt Buchtitel, Autoren, Erscheinungsjahre, ISBNs und generiert Cover-URLs.
 * Nutzt einen Debounce, um nicht bei jedem Tastendruck die API zu überlasten.
 *
 * @param query - Der aktuelle Suchbegriff aus dem Eingabefeld.
 * @returns Ein Objekt mit dem Ladezustand und den formatierten Suchergebnissen.
 */
export function useOpenLibrarySearch(query: string) {
  // --- STATE ----
  const [results, setResult] = useState<OpenLibraryBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- API-AUFRUF ---
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
          )}&limit=5&fields=${OPEN_LIBRARY_FIELDS}`,
        );
        const data: OpenLibraryResponse = await response.json();

        const formattedResults: OpenLibraryBook[] = data.docs.map((doc: OpenLibraryDoc) => ({
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
        console.error("Fehler bei der OpenLibrary-Suche", error);
        setResult([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);
  return { isSearching, results };
}
