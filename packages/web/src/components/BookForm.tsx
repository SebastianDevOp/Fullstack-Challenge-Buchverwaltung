"use client";
import { useState } from "react";
import { createAuthorActio } from "@/app/books/action";
import { type Errors, useForm } from "@/hooks/useForm";
import { type OpenLibraryBook, useOpenLibrarySearch } from "@/hooks/useOpenLibrarySearch";
import type { Author, Book } from "@/types/models";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { BookTitleAutocomplete } from "./ui/BookTitleAutocomplete";

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
        (a: Author) =>
          a.name.toLowerCase().includes(book.authorName?.toLowerCase()) ||
          book.authorName?.toLowerCase().includes(a.name.toLowerCase()),
      );

      if (matchedAuthor) {
        updateFormValue("authorId", matchedAuthor.id);
      } else {
        try {
          const newAuthor = await createAuthorActio(book.authorName);

          setLocalAuthors((prev: Author[]) => [...prev, newAuthor]);
          updateFormValue("authorId", newAuthor.id);
        } catch (error) {
          console.log("Fehler beim automatischen Anlegen des Authors.", error);
        }
      }
    }
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

        <BookTitleAutocomplete
          results={results}
          isSearching={isSearching}
          handleSelectBook={handleSelectBook}
          formData={formData}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

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
