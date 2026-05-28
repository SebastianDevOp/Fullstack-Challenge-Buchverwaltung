"use Client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { title } from "node:process";
import { Select } from "./ui/Select";

interface BookFormData {
  title?: string;
  authorId: number;
  isbn?: number;
  year?: number;
}

type BookformProps = {
  initialValue?: BookFormData;
  authors: { id: number | string; name: string }[];
  onSubmit: (values: BookFormData) => Promise<void> | void;
  submitLabel?: string;
};

export const Bookform = ({ initialValue, authors, onSubmit }: BookformProps) => {
  const [formData, SetFormData] = useState<BookFormData>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    SetFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        <p>Bücher erstellen</p>
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
          onChange={() => console.log("hallo")}
          required={true}
          options={authors}
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
      </form>
    </div>
  );
};
