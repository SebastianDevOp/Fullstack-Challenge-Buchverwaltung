"use client";

import { Bookform } from "@/components/BookForm";
import { useState } from "react";

export default function BooksPage() {
  const [authors] = useState<Author[]>([
    { id: 1, name: "J.K. Rowling" },
    { id: 2, name: "George Orwell" },
    { id: 3, name: "J.R.R. Tolkien" },
    { id: 4, name: "Jane Austen" },
    { id: 5, name: "F. Scott Fitzgerald" },
    { id: 6, name: "Mary Shelley" },
    { id: 7, name: "Stephen King" },
    { id: 8, name: "Agatha Christie" },
    { id: 9, name: "Isaac Asimov" },
    { id: 10, name: "Arthur Conan Doyle" },
  ]);

  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Harry Potter und der Stein der Weisen",
      authorId: 1,
      isbn: 9783551551672,
      year: 1997,
    },
    { id: 2, title: "1984", authorId: 2, isbn: 9783548225623, year: 1949 },
    { id: 3, title: "Der Herr der Ringe", authorId: 3, isbn: 9783608939849, year: 1954 },
    { id: 4, title: "Stolz und Vorurteil", authorId: 4, year: 1813 },
    { id: 5, title: "Der große Gatsby", authorId: 5, year: 1925 },
    { id: 6, title: "Frankenstein", authorId: 6, year: 1818 },
    { id: 7, title: "Shining", authorId: 7, year: 1977 },
    { id: 8, title: "Mord im Orient-Express", authorId: 8, year: 1934 },
    { id: 9, title: "Foundation", authorId: 9, year: 1951 },
    { id: 10, title: "Eine Studie in Scharlachrot", authorId: 10, year: 1887 },
  ]);
  const handleSubmit = () => {
    console.log();
  };

  return (
    <div>
      <h1>Bücher</h1>
      <Bookform authors={authors} onSubmit={handleSubmit} />
    </div>
  );
}
