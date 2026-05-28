"use Client";

import { useState } from "react";
import { Input } from "./ui/Input";

interface BookformData {
    title? : string;
    authorId : number;
    isbn? : number
    year? : number
}

type BookformProps = {
  initialValue?: { title?: string; authorId: number; isbn?: number; year?: number };
  authors: { id: number; name: string }[];
  onSubmit: (values: any) => Promise<void> | void;
  submitLabel?: string;
};

export const Bookform = ({ initialValue }: BookformProps) => {
  const [values, SetValues] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetValues((prev => { ...prev, [name] : value}))
  };

  return (
    <div className="form-container">
      <form action="">
        <p>Bücher erstellen</p>
        <Input
          label="Buchtitel"
          name="title"
          value={values?.title}
          onChange={handleChange}
          required={true}
        />
      </form>
    </div>
  );
};
