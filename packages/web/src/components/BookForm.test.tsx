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

  it("übergibt die eingegebenen Werte an onSubmit", async () => {
    const { user, onSubmit, titleField, authorField, isbnField, submitButton } = setup();

    await user.type(titleField, "Der Prozess");
    await user.selectOptions(authorField, "7");
    await user.type(isbnField, "9783150091319");
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Der Prozess",
        authorId: "7",
        isbn: "9783150091319",
      }),
    );
  });

  it("sperrt den Absenden-Knopf, solange Pflichtfelder fehlen", async () => {
    const { user, onSubmit, submitButton } = setup();

    expect(submitButton).toBeDisabled();

    await user.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("zeigt beim Öffnen noch keine Fehlermeldung", () => {
    setup();

    expect(screen.queryByText("Autor bitte auswählen")).not.toBeInTheDocument();
    expect(screen.queryByText("Titel notwendig")).not.toBeInTheDocument();
  });

  it("meldet einen fehlenden Autor, sobald das Feld verlassen wurde", async () => {
    const { user, authorField } = setup();

    await user.click(authorField);
    await user.tab();

    expect(screen.getByText("Autor bitte auswählen")).toBeInTheDocument();
  });
});
