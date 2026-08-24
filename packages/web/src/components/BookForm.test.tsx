import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiAuthor } from "@/lib/booksApi";
import { BookForm } from "./BookForm";

const AUTHORS: ApiAuthor[] = [
  { id: 7, name: "Franz Kafka" },
  { id: 9, name: "Hermann Hesse" },
];

const setup = () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<BookForm authors={AUTHORS} onSubmit={onSubmit} />);

  return {
    user,
    onSubmit,
    titleField: screen.getByLabelText("Buchtitel"),
    authorField: screen.getByRole("combobox"),
    isbnField: screen.getByLabelText("ISBN"),
    yearField: screen.getByLabelText("Erscheinungsjahr"),
    submitButton: screen.getByRole("button", { name: "Speichern" }),
  };
};

describe("BookForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ docs: [] })))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("übergibt die eingegebenen Werte an onSubmit", async () => {});

  it("sperrt den Absenden-Knopf, solange Pflichtfelder fehlen", async () => {});

  it("zeigt beim Öffnen noch keine Fehlermeldung", () => {});

  it("meldet einen fehlenden Autor, sobald das Feld verlassen wurde", async () => {});
});
