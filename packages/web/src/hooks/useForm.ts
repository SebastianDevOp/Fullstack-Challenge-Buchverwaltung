import { useState } from "react";

type Touched<T> = Partial<Record<keyof T, boolean>>;
export type Errors<T> = Partial<Record<keyof T, string>>;

type UseFormOption<T> = {
  initialValue: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Errors<T>;
};

export function useForm<T>({ initialValue, onSubmit, validate }: UseFormOption<T>) {
  const [formData, setFormData] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Touched<T>>({});
  const errors: Errors<T> = validate ? validate(formData) : {};
  const noError = Object.keys(errors).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (noError === 0) {
      await onSubmit(formData);
      setFormData(initialValue);
    } else {
      alert("Eingabe unvollständig");
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    noError,
  };
}
