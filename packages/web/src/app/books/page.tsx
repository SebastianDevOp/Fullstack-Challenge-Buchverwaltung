"use client";
import { useEffect, useState } from "react";
import { Bookform } from "@/components/BookForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { useBookPageData } from "@/hooks/useBooksPageData";
import type { Author, Book } from "@/types/models";

const TABLE_HEADERS = ["Titel", "Autor", "Erscheinungsjahr"];

export default function BooksPage() {
  //--- HOOKS & DATA ---
  const { fetchedBooks, fetchedAuthors, isLoading } = useBookPageData();

  //--- STATE ---
  const [formVisibility, setFormVisibility] = useState<boolean>(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  // --- EFFECTS ---
  useEffect(() => {
    if (fetchedAuthors && fetchedAuthors.length > 0) {
      setAuthors(fetchedAuthors);
    }
  }, [fetchedAuthors]);

  useEffect(() => {
    if (fetchedBooks && fetchedBooks.length > 0) {
      setBooks(fetchedBooks);
    }
  }, [fetchedBooks]);

  // --- HANDLER ---
  const handleOpenCreateForm = () => {
    setEditingBook(null);
    setFormVisibility(true);
  };

  const handleOpenEditing = (book: Book) => {
    setEditingBook(book);
    setFormVisibility(true);
  };

  const handleCloseFrom = () => {
    setEditingBook(null);
    setFormVisibility(false);
  };

  const handleFormSubmit = async (formData: Book) => {
    if (editingBook) {
      await handleUpdateBook(formData);
    } else {
      await handleCreateBook(formData);
    }
  };

  const handleCreateBook = async (newBook: Book) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Erstellen des Buchs");
      }
      const createdBook = await response.json();

      setBooks((prev) => [...prev, createdBook]);

      handleCloseFrom();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const handleDeleteBook = async ({ id }: Book) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen des Buches");
      }
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen des Buches", error);
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const response = await fetch(`/api/books/${updatedBook.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Bearbeiten des Buches");
      }

      setBooks((prev) =>
        prev.map((book) => {
          if (Number(book.id) === Number(updatedBook.id)) {
            return updatedBook;
          } else {
            return book;
          }
        }),
      );
      handleCloseFrom();
    } catch (error) {
      console.log("Fehler beim Bearbeiten des Buches", error);
    }
  };
  // --- HILFSFUNKTIONEN ---
  const getAuthorName = (id: number) => {
    const authorById = authors.find((a) => a.id === Number(id));

    return authorById ? authorById.name : "Unbekannt";
  };

  // --- LOADING-STATE ---
  if (isLoading && books.length === 0) {
    return <div className="p-6 text-center">Daten werden geladen...</div>;
  }

  return (
    <div>
      <div className="flex flex-row gap-6">
        <Input
          label={"Suche..."}
          name={"Suche"}
          onChange={() => console.log("Suche gestartet...")}
        />
        <Button variant="primary" type="button" onClick={handleOpenCreateForm}>
          {"Buch hinzufügen"}
        </Button>
      </div>
      <div className="mt-6">
        <Table
          books={books}
          headers={TABLE_HEADERS}
          onDeleteClick={handleDeleteBook}
          getAuthorName={getAuthorName}
          onUpdateClick={handleOpenEditing}
        />
      </div>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 transition-transform duration-500 ease-in-out"
        style={{
          transform: formVisibility ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <Bookform
          key={editingBook?.id || "new"}
          authors={authors}
          onSubmit={handleFormSubmit}
          initialValues={editingBook ? editingBook : undefined}
          submitLabel={editingBook ? "Aktualisieren" : "Speichern"}
        />
      </div>

      <button
        type="button"
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-500"
        style={{
          opacity: formVisibility ? 1 : 0,
          pointerEvents: formVisibility ? "auto" : "none",
        }}
        onClick={handleCloseFrom}
      />
    </div>
  );
}
