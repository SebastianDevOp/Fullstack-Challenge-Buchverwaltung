"use client";

import { Bookform } from "@/components/BookForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Table } from "@/components/ui/Table";
import { useBooksController } from "@/hooks/useBooksController";
import type { Author, Book } from "@/types/models";

const TABLE_HEADERS = ["Titel", "Autor", "Erscheinungsjahr"];

// --- PROPS ---
type BooksClientViewProps = {
  initialBooks: Book[];
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

  // --- HILFSFUNKTIONEN ---
  const getAuthorName = (id: number) => {
    const authorById = authors.find((a) => a.id === Number(id));
    return authorById ? authorById.name : "Unbekannt";
  };

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
          getAuthorName={getAuthorName}
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
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 transition-transform duration-500 ease-in-out"
        style={{ transform: formVisibility ? "translateX(0)" : "translateX(100%)" }}
      >
        <Bookform
          key={editingBook?.id || "new"}
          authors={authors}
          onSubmit={handleFormSubmit}
          initialValues={editingBook ? editingBook : undefined}
          submitLabel={editingBook ? "Aktualisieren" : "Speichern"}
        />
      </div>

      {formVisibility && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-500"
          onClick={closeForm}
        />
      )}
    </div>
  );
}
