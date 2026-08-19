"use client";

import { useState } from "react";

// --- PROPS ---
export type BookCoverProps = {
  isbn: string | null;
  title: string;
  className?: string;
};

export const BookCover = ({ isbn, className = "h-14 w-10", title }: BookCoverProps) => {
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  if (!isbn || hasFailed) {
    return <div className={`${className} bg-gray-100 rounded`} />;
  }
  return (
    // biome-ignore lint/performance/noImgElement: Cover kommen von OpenLibrary, next/image lohnt bei 40px nicht
    <img
      src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`}
      alt={`Cover von ${title}`}
      loading="lazy"
      onError={() => setHasFailed(true)}
      className={className}
    />
  );
};
