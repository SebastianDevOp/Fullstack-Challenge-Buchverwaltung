import { useEffect, useState } from "react";
import type { Author, Book, BookRow } from "@/types/models";

export function useBookPageData() {
  // --- States ---
  const [fetchedBooks, setBooks] = useState<Book[]>([]);
  const [fetchedAuthors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- API-CALLS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsResponse, booksResponse] = await Promise.all([
          fetch("/api/authors"),
          fetch("/api/books"),
        ]);

        const authorsData = await authorsResponse.json();
        const booksData = await booksResponse.json();

        const flatBooks = booksData.map((row: BookRow) => row.books);

        setAuthors(authorsData);
        setBooks(flatBooks);
      } catch (error) {
        console.log("Failed to fetch Data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { fetchedBooks, fetchedAuthors, isLoading };
}
