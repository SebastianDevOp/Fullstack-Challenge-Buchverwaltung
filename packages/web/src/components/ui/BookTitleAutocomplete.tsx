import { type ChangeEvent, useState } from "react";
import type { OpenLibraryBook } from "@/hooks/useOpenLibrarySearch";
import type { Book } from "@/types/models";
import { Input } from "./Input";

type BookTitleAutocompleteProps = {
  results: OpenLibraryBook[];
  isSearching: boolean;
  handleSelectBook: (book: OpenLibraryBook) => void;
  formData: Book;
  touched: Partial<Record<keyof Book, boolean>>;
  errors: Partial<Record<keyof Book, string>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const BookTitleAutocomplete = ({
  results,
  isSearching,
  handleSelectBook,
  formData,
  touched,
  errors,
  handleChange,
  handleBlur,
}: BookTitleAutocompleteProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative flex flex-col">
      <div>
        <Input
          label="Buchtitel"
          name="title"
          value={formData.title}
          onChange={(e) => {
            handleChange(e);
            setShowDropdown(true);
          }}
          required={true}
          error={touched.title ? errors.title : ""}
          onBlur={(e) => {
            handleBlur(e);
            setTimeout(() => setShowDropdown(false), 200);
          }}
        />
      </div>

      {showDropdown && (isSearching || results.length > 0) && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-3 text-sm text-gray-500 text-center">Suche in OpenLibrary...</div>
          ) : (
            <ul className="py-1">
              {results.map((book) => (
                <li
                  key={book.key}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectBook(book);
                    setShowDropdown(false);
                  }}
                >
                  <span className="font-medium text-gray-900">{book.title}</span>
                  <span className="text-xs text-gray-500">
                    {book.authorName ? `von ${book.authorName}` : "Unbekannter Autor"}
                    {book.year ? ` • ${book.year}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
