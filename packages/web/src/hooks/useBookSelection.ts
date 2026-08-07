import type { Author } from "@book-manager/database";
import { useState } from "react";
import { createAuthorAction } from "@/app/books/action";
import type { OpenLibraryBook } from "./useOpenLibrarySearch";

/**
 * Hook für die Buchauswahl via OpenLibrary API.
 * Isoliert den lokalen Autoren-State und die Logik zum Befüllen des Formulars.
 * Zudem automatische Anlegen fehlender Autoren über Server-ACtions.
 * @param initialAuthors - Initale Lister der Autoren aus dem DB.
 * @param updateFormValue - Funktion, um die Felder des Hauptformulars zu aktualisieren.
 * @returns Objekt mit Autoren-State und dem Auswahl-Handler.
 */
export function useBookSelection(
  initialAuthors: Author[],
  updateFormValue: (name: string, value: string | number) => void,
) {
  // --- LOKALER STATE ---
  const [localAuthors, setLocalAuthors] = useState(initialAuthors);

  // --- HANDLER FÜR BUCHAUSWAHL ---
  const handleSelectBook = async (book: OpenLibraryBook) => {
    updateFormValue("title", book.title);
    if (book.isbn) updateFormValue("isbn", book.isbn);
    if (book.year) updateFormValue("year", book.year);
    if (book.authorName) {
      const searchName = book.authorName.toLowerCase();
      const matchedAuthor = localAuthors.find(
        (a: Author) =>
          a.name.toLowerCase().includes(searchName) || searchName.includes(a.name.toLowerCase()),
      );

      if (matchedAuthor) {
        updateFormValue("authorId", matchedAuthor.id);
      } else {
        try {
          const newAuthor = await createAuthorAction(book.authorName);
          setLocalAuthors((prev: Author[]) => [...prev, newAuthor]);
          updateFormValue("authorId", newAuthor.id);
        } catch (error) {
          console.log("Fehler beim automatischen Anlegen des Authors.", error);
        }
      }
    }
  };

  return {
    handleSelectBook,
    localAuthors,
  };
}
