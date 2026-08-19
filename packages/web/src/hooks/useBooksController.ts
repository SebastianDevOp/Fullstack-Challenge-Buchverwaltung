import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { createBookAction, deleteBookAction, updateBookAction } from "@/app/books/action";
import type { BookFormValues } from "@/components/BookForm";
import type { ApiBook } from "@/lib/booksApi";

/**
 * Controller-Hook für die Bücher-Übersichtsseite.
 * Kapselt das Routing , State-Manangemet für BookForm
 * sowie die Kommunikation mit dem Server Actions.
 *
 * @param q - Aktuelle Suchbegriff aus der URL.
 * @param totalCount - Gesamtanzahl der gefundenen Bücher.
 * @param pageSize - Anzahl der Bücher pro Seite.
 * @returns Objekt mir States und Handlerfunktionen.
 */
export function useBooksController(q: string, totalCount: number, pageSize: number) {
  // --- NEXT.JS ROUTING ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- BERECHNUNG ---
  const totalPages = Math.ceil(totalCount / pageSize);

  // --- LOKALER STATE ---
  const [inputValue, setInputValue] = useState(q);
  const [formVisibility, setFormVisibility] = useState(false);
  const [editingBook, setEditingBook] = useState<ApiBook | null>(null);

  // --- HILFSFUNKTION ---
  const updateUrl = (newParams: { q?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.q !== undefined) {
      if (newParams.q) params.set("q", newParams.q);
      else params.delete("q");
    }
    if (newParams.page !== undefined) {
      if (newParams.page > 1) params.set("page", newParams.page.toString());
      else params.delete("page");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  // --- DEBOUNCE ---
  const debouncedUpdateUrl = useDebouncedCallback(updateUrl, 300);

  // --- HANDLER FÜR SUCHE & PAGINIERUNG ---
  const handleSearch = (term: string) => {
    setInputValue(term);
    debouncedUpdateUrl({ q: term, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateUrl({ page: newPage });
    }
  };

  // --- HANDLER FÜR SERVER ACTIONS  ---
  const handleFormSubmit = async (formData: BookFormValues) => {
    try {
      const result = editingBook
        ? await updateBookAction(formData)
        : await createBookAction(formData);

      if (result?.error === "duplicate-isbn") {
        toast.error("Ein Buch mit dieser ISBN existiert bereits.");
        return;
      }

      toast.success(editingBook ? "Buch erfolgreich aktualisiert!" : "Buch erfolgreich erstellt!");
      setFormVisibility(false);
      setEditingBook(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Ein Fehler ist aufgetreten.");
      }
      throw error;
    }
  };

  const handleDeleteClick = async (book: ApiBook) => {
    const confirmed = window.confirm(
      `Bist du sicher, dass du das Buch "${book.title}" löschen möchtest?`,
    );

    if (!confirmed) {
      return;
    }
    try {
      await deleteBookAction(book.id);
      toast.success("Buch erfolgreich gelöscht!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Fehler beim Löschen des Buches.");
      }
    }
  };

  // --- HANDLER FÜR FORMULAR-SICHTBARKEIT ---
  const openCreateForm = () => {
    setEditingBook(null);
    setFormVisibility(true);
  };

  const openEditForm = (book: ApiBook) => {
    setEditingBook(book);
    setFormVisibility(true);
  };

  const closeForm = () => {
    setEditingBook(null);
    setFormVisibility(false);
  };

  return {
    closeForm,
    editingBook,
    formVisibility,
    handleDeleteClick,
    handleFormSubmit,
    handlePageChange,
    handleSearch,
    inputValue,
    openCreateForm,
    openEditForm,
    totalPages,
  };
}
