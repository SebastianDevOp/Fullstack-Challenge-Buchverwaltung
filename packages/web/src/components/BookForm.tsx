"use client";
import { useBookSelection } from "@/hooks/useBookSelection";
import { type Errors, useForm } from "@/hooks/useForm";
import { useOpenLibrarySearch } from "@/hooks/useOpenLibrarySearch";
import type { Author, Book } from "@/types/models";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { BookTitleAutocomplete } from "./ui/BookTitleAutocomplete";

export type BookFormProps = {
  initialValues?: Book;
  authors: Author[];
  onSubmit: (values: Book) => Promise<void> | void;
  submitLabel?: string;
};

export const BookForm = ({
  initialValues,
  authors: initialAuthors,
  onSubmit,
  submitLabel = "Speichern",
}: BookFormProps) => {
  const { formData, handleSubmit, handleChange, handleBlur, touched, errors, hasErrors } =
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
  const updateFormValue = (name: string, value: string | number) => {
    handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };
  const { handleSelectBook, localAuthors } = useBookSelection(initialAuthors, updateFormValue);
  const { results, isSearching } = useOpenLibrarySearch(formData.title);

  return (
    <div className="w-full max-w-lg mx-auto mt-12 bg-white rounded-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            {initialValues ? "Buch bearbeiten" : "Buch hinzufügen"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {initialValues
              ? "Passe die Details des Buches an."
              : "Trage die Details für das neue Buch ein."}
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
          <Button variant="primary" type="submit" disabled={hasErrors}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};
