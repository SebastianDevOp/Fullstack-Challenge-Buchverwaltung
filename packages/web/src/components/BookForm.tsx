"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";

interface BookFormData {
  title?: string;
  authorId: number;
  isbn?: number;
  year?: number;
}

export type BookformProps = {
  initialValues?: BookFormData;
  authors: { id: number | string; name: string }[];
  onSubmit: (values: BookFormData) => Promise<void> | void;
  submitLabel?: string;
};

export const Bookform = ({
  initialValues,
  authors,
  onSubmit,
  submitLabel = "Speichern",
}: BookformProps) => {
  const [formData, SetFormData] = useState<BookFormData>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    SetFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hier muss ich noch Schauen was ich genau machen soll
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Buch hinzufügen</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Trage die Details für das neue Buch ein.
          </p>
        </div>

        <Input
          label="Buchtitel"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          required={true}
        />
        <Select
          label="Autoren"
          name="authors"
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
        />
        <Input
          label="Erscheinungsjahr"
          name="year"
          value={formData?.year}
          onChange={handleChange}
          required={false}
        />
        <div className="pt-6 flex justify-between w-full">
          <Button variant="danger" type="button" disabled={false}>
            Abbrechen
          </Button>

          <Button variant="primary" type="submit" disabled={false}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};
