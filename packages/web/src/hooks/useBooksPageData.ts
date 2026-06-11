import { Author, Book } from "@/app/books/page";
import { useEffect, useState } from "react";

export function useBookPageData() {
  // --- States ---
  const [fetchedBooks, setBooks] = useState<Book[]>([]);
  const [fetchedAuthors, setAuthors] = useState<Author[]>([]);

  // --- API-CALLS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsResponse, booksResponse] = await Promise.all([
          fetch("/api/authors"),
          fetch("api/books"),
        ]);

        const authorsData = await authorsResponse.json();
        const booksData = await booksResponse.json();

        const flatBooks = booksData.map((row) => row.books);

        setAuthors(authorsData);
        setBooks(flatBooks);
      } catch (error) {
        console.log("Failed to fetch Data: ", error);
      }
    };
    loadData();
  }, []);

  return { fetchedBooks, fetchedAuthors };
}
