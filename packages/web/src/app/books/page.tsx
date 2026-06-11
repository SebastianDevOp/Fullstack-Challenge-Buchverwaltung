"use client";

import { useEffect, useState } from "react";
import { Bookform } from "@/components/BookForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBookPageData } from "@/hooks/useBooksPageData";

export type Author = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  title: string;
  authorId: number;
  isbn?: number;
  year?: number;
};
export default function BooksPage() {
  //--- STATES ---
  const { fetchedBooks, fetchedAuthors } = useBookPageData();
  const [formVisibility, setFormVisibility] = useState<boolean>(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

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
  const handleSubmit = async (newBook: Book) => {
    const prepBook: Book = {
      ...newBook,
      id: Date.now(),
    };

    setBooks((prev) => [...prev, prepBook]);
    setFormVisibility(!formVisibility);
  };

  const handleClick = (toDelete: Book) => {
    setBooks((prev) => prev.filter((book) => book.id !== toDelete.id));
  };

  const getAuthorName = (id: number) => {
    const authorById = authors.find((a) => a.id === Number(id));

    return authorById ? authorById.name : "Unbekannt";
  };

  return (
    <div>
      <div className="flex flex-row gap-6">
        <Input label={"Suche..."} name={"Suche"} onChange={() => console.log("hallo")} />
        <Button
          variant="primary"
          type="button"
          disabled={false}
          onClick={() => setFormVisibility(!formVisibility)}
        >
          {"Buch hinzufügen"}
        </Button>
      </div>
      <div className="">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-500 bg-blue-grey-50">Titel</th>
              <th className="p-4 border-b border-blue-gray-500 bg-blue-grey-50">Autor</th>
              <th className="p-4 border-b border-blue-gray-500 bg-blue-grey-50">
                Erscheinungsjahr
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              const authorName = getAuthorName(book.authorId);

              return (
                <tr key={book.id}>
                  <td className="p-4 border-b ">{book.title}</td>
                  <td className="p-4 border-b">{authorName}</td>
                  <td className="p-4 border-b">{book.year}</td>
                  <button type="button" onClick={() => handleClick(book)}>
                    X
                  </button>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 transition-transform duration-500 ease-in-out"
        style={{
          transform: formVisibility ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <Bookform authors={authors} onSubmit={handleSubmit} />
      </div>

      <button
        type="button"
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-500"
        style={{
          opacity: formVisibility ? 2 : 0,
          pointerEvents: formVisibility ? "auto" : "none",
        }}
        onClick={() => setFormVisibility(false)}
      />
    </div>
  );
}
