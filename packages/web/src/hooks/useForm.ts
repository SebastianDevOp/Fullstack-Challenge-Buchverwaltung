import { useState } from "react";

// --- TYPEN ---
type Touched<T> = Partial<Record<keyof T, boolean>>;
export type Errors<T> = Partial<Record<keyof T, string>>;

type UseFormOption<T> = {
  initialValue: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Errors<T>;
};

/**
 * Generischer Hook für das Formular-Management.
 * Isoliert den State für Werte, Validierungsfehler und den "Touched"-Zustand.
 *
 * @param initialValue - Die Startwerte des Formulars.
 * @param onSubmit - Funktion, die bei erfolgreichem Submit ausgeführt wird.
 * @param validate - Optionale Funktion zur Validierung der Felder.
 * @returns Objekt mit States und Handlern für das Formular.
 */
export function useForm<T>({ initialValue, onSubmit, validate }: UseFormOption<T>) {
  // --- LOKALER STATE ---
  const [formData, setFormData] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Touched<T>>({});

  // --- ABGELEITETER STATE ---
  const errors: Errors<T> = validate ? validate(formData) : {};
  const hasErrors = Object.keys(errors).length > 0;

  // --- HANDLER UI-EVENTS ---
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- HANDLER SUBMIT ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasErrors) {
      await onSubmit(formData);
      setFormData(initialValue);
      setTouched({});
    } else {
      console.warn("Formular enthält Fehler und kann nicht abgesendet werden.");
    }
  };

  return {
    errors,
    formData,
    handleBlur,
    handleChange,
    handleSubmit,
    hasErrors,
    setFormData,
    touched,
  };
}
