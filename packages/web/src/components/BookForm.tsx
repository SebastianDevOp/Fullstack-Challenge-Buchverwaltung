"use client";
import { useState } from "react";
import { createAuthorActio } from "@/app/books/action";
import { type Errors, useForm } from "@/hooks/useForm";
import { type OpenLibraryBook, useOpenLibrarySearch } from "@/hooks/useOpenLibrarySearch";
import type { Author, Book } from "@/types/models";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export type BookformProps = {
  initialValues?: Book;
  authors: Author[];
  onSubmit: (values: Book) => Promise<void> | void;
  submitLabel?: string;
};

export const Bookform = ({
  initialValues,
  authors: initialAuthors,
  onSubmit,
  submitLabel = "Speichern",
}: BookformProps) => {
  const { formData, handleSubmit, handleChange, handleBlur, touched, errors, noError } =
    useForm<Book>({
      initialValue: {
        id: initialValues?.id || 0,
        title: initialValues?.title || "",
        authorId: initialValues?.authorId || 0,
        isbn: initialValues?.isbn || "",
        year: initialValues?.year || undefined,
      },
      onSubmit: onSubmit,
      validate: (formData) => {
        const errors: Errors<typeof formData> = {};
        if (!formData.title) errors.title = "Titel notwendig";
        if (!formData.authorId) errors.authorId = "Autor bitte auswählen";
        return errors;
      },
    });
  const [localAuthors, setLocalAuthors] = useState(initialAuthors);
  const [showDropdown, setShowDropdown] = useState(false);
  const { results, isSearching } = useOpenLibrarySearch(formData.title);

  const updateFormValue = (name: string, value: string | number) => {
    handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSelectBook = async (book: OpenLibraryBook) => {
    updateFormValue("title", book.title);
    if (book.isbn) updateFormValue("isbn", book.isbn);
    if (book.year) updateFormValue("year", book.year);
    if (book.authorName) {
      const matchedAuthor = localAuthors.find(
        (a: any) =>
          a.name.toLowerCase().includes(book.authorName!.toLowerCase()) ||
          book.authorName!.toLowerCase().includes(a.name.toLowerCase()),
      );

      if (matchedAuthor) {
        updateFormValue("authorId", matchedAuthor.id);
      } else {
        try {
          const newAuthor = await createAuthorActio(book.authorName);

          setLocalAuthors((prev: any) => [...prev, newAuthor]);
          updateFormValue("authorId", newAuthor.id);
        } catch (error) {
          console.log("Fehler beim automatischen Anlegen des Authors.", error);
        }
      }
    }

    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-12 bg-white rounded-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Buch hinzufügen</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Trage die Details für das neue Buch ein.
          </p>
        </div>

        <div className="relative flex flex-col">
          <div
            onFocus={() => setShowDropdown(true)}
            onBlur={(e) => {
              handleBlur(e);
              setTimeout(() => setShowDropdown(false), 200);
            }}
          >
            <Input
              label="Buchtitel"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required={true}
              error={touched.title ? errors.title : ""}
            />
          </div>

          {showDropdown && (isSearching || results.length > 0) && (
            <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-500 text-center">Suche in OpenLibrary...</div>
              ) : (
                <ul className="py-1">
                  {results.map((book, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectBook(book);
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

        <Select
          label="Autoren"
          name="authorId"
          value={formData?.authorId}
          onChange={handleChange}
          required={true}
          options={localAuthors.map((author) => ({
            value: author.id,
            label: author.name,
          }))}
        />
        <Input
          label="ISBN"
          name="isbn"
          value={formData?.isbn}
          onChange={handleChange}
          required={false}
        />
        <Input
          label="Erscheinungsjahr"
          name="year"
          value={formData?.year}
          onChange={handleChange}
          required={false}
        />

        <div className="flex justify-end w-full">
          <Button variant="primary" type="submit" disabled={!!noError}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};
