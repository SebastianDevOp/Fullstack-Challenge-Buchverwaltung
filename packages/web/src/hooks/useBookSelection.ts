import { useState } from "react";
import { toast } from "sonner";
import { createAuthorAction } from "@/app/books/action";
import type { ApiAuthor } from "@/lib/booksApi";
import type { OpenLibraryBook } from "./useOpenLibrarySearch";

/**
 * Hook für die Buchauswahl via OpenLibrary API.
 * Isoliert den lokalen Autoren-State und die Logik zum Befüllen des Formulars.
 * Der Autor wird serverseitig aufgelöst, damit keine Dubletten entstehen.
 *
 * @param initialAuthors - Initiale Liste der Autoren aus der DB.
 * @param updateFormValue - Funktion, um die Felder des Hauptformulars zu aktualisieren.
 * @returns Objekt mit Autoren-State und dem Auswahl-Handler.
 */
export function useBookSelection(
  initialAuthors: ApiAuthor[],
  updateFormValue: (name: string, value: string | number) => void,
) {
  // --- LOKALER STATE ---
  const [localAuthors, setLocalAuthors] = useState(initialAuthors);

  // --- HANDLER FÜR BUCHAUSWAHL ---
  const handleSelectBook = async (book: OpenLibraryBook) => {
    updateFormValue("title", book.title);
    if (book.isbn) updateFormValue("isbn", book.isbn);
    if (book.year) updateFormValue("year", book.year);
    if (!book.authorName) return;

    try {
      const author = await createAuthorAction(book.authorName);
      setLocalAuthors((prev) => (prev.some((a) => a.id === author.id) ? prev : [...prev, author]));
      updateFormValue("authorId", author.id);
    } catch {
      toast.error("Der Autor konnte nicht zugeordnet werden.");
    }
  };

  return {
    handleSelectBook,
    localAuthors,
  };
}
