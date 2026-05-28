"use client";

import { Bookform } from "@/components/BookForm";

export default function BooksPage() {
  const initialValue = {};

  return (
    <div>
      <h1>Bücher</h1>
      <p>Diese Seite wird von dir implementiert. Viel Erfolg!</p>
      <Bookform initialValue={initialValue} />
    </div>
  );
}
