"use client";
import { type Errors, useForm } from "@/hooks/useForm";
import type { Book } from "@/types/models";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export type BookformProps = {
  initialValues?: Book;
  authors: { id: number | string; name: string }[];
  onSubmit: (values: Book) => Promise<void> | void;
  submitLabel?: string;
};

export const Bookform = ({
  initialValues,
  authors,
  onSubmit,
  submitLabel = "Speichern",
}: BookformProps) => {
  const { formData, handleSubmit, handleChange, handleBlur, touched, errors, noError } =
    useForm<Book>({
      initialValue: {
        id: initialValues?.id || 0,
        title: initialValues?.title || " ",
        authorId: initialValues?.authorId || 0,
        isbn: initialValues?.isbn,
        year: initialValues?.year,
      },
      onSubmit: onSubmit,
      validate: (formData) => {
        const errors: Errors<typeof formData> = {};
        if (!formData.title) errors.title = "Titel notwendig";
        if (!formData.authorId) errors.authorId = "Autor bitte auswählen";
        return errors;
      },
    });

  return (
    <div className="w-full max-w-lg mx-auto mt-12 bg-white rounded-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Buch hinzufügen</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Trage die Details für das neue Buch ein.
          </p>
        </div>

        <Input
          label="Buchtitel"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          required={true}
          error={touched.title ? errors.title : ""}
        />
        <Select
          label="Autoren"
          name="authorId"
          value={formData?.authorId}
          onChange={handleChange}
          required={true}
          options={authors.map((author) => ({
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
          error={touched.authorId ? errors.authorId : ""}
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
