"use client";

import type { Author } from "@book-manager/database";
import { useEffect, useRef } from "react";
import { BookForm } from "@/components/BookForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Table } from "@/components/ui/Table";
import { useBooksController } from "@/hooks/useBooksController";
import type { ApiBook } from "@/lib/booksApi";

const TABLE_HEADERS = ["Titel", "Autor", "Erscheinungsjahr"];

// --- PROPS ---
type BooksClientViewProps = {
  initialBooks: ApiBook[];
  authors: Author[];
  totalCount: number;
  currentPage: number;
  q: string;
  pageSize: number;
};

export function BooksClientView({
  initialBooks,
  authors,
  totalCount,
  currentPage,
  q,
  pageSize,
}: BooksClientViewProps) {
  const {
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
  } = useBooksController(q, totalCount, pageSize);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (formVisibility && !dialog.open) {
      dialog.showModal();
    } else if (!formVisibility && dialog.open) {
      dialog.close();
    }
  }, [formVisibility]);

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 items-end">
        <div className="flex-1">
          <Input
            value={inputValue}
            label={"Suche..."}
            name={"Suche"}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="primary" type="button" onClick={openCreateForm}>
          {"Buch hinzufügen"}
        </Button>
      </div>

      <div className="mt-6">
        <Table
          books={initialBooks}
          headers={TABLE_HEADERS}
          onDeleteClick={handleDeleteClick}
          onUpdateClick={(book) => openEditForm(book)}
        />
      </div>
      <div className="mt-6">
        <PaginationBar
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape schließt den Dialog nativ */}
      <dialog
        ref={dialogRef}
        onClose={closeForm}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeForm();
        }}
        className="m-0 ml-auto h-full max-h-full w-full max-w-md border-0 bg-white p-6 shadow-2xl backdrop:bg-black/40"
      >
        {formVisibility && (
          <BookForm
            key={editingBook?.id || "new"}
            authors={authors}
            onSubmit={handleFormSubmit}
            initialValues={editingBook ? editingBook : undefined}
            submitLabel={editingBook ? "Aktualisieren" : "Speichern"}
          />
        )}
      </dialog>
    </div>
  );
}
