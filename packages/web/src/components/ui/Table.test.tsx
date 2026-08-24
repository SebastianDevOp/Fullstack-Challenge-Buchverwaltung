import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ApiBook } from "@/lib/booksApi";
import { Table } from "./Table";

const HEADERS = ["Cover", "Titel", "Autor", "Jahr"];

const kafka: ApiBook = {
  id: 1,
  title: "Der Prozess",
  isbn: "9783150091319",
  year: 1925,
  author: "Franz Kafka",
  authorId: 7,
};

const setup = (books: ApiBook[], searchTerm = "") => {
  const onDeleteClick = vi.fn();
  const onUpdateClick = vi.fn();

  render(
    <Table
      books={books}
      headers={HEADERS}
      searchTerm={searchTerm}
      onDeleteClick={onDeleteClick}
      onUpdateClick={onUpdateClick}
    />,
  );

  return { onDeleteClick, onUpdateClick };
};

describe("Table", () => {
  it("zeigt Titel und Autor eines Buches an", () => {
    setup([kafka]);

    expect(screen.getByText("Der Prozess")).toBeInTheDocument();
    expect(screen.getByText("Franz Kafka")).toBeInTheDocument();
  });

  it("meldet eine leere Sammlung, wenn nicht gesucht wurde", () => {
    setup([]);

    expect(screen.getByText("Keine Bücher in der Datenbank vorhanden.")).toBeInTheDocument();
  });

  it("nennt den Suchbegriff, wenn die Suche nichts findet", () => {
    setup([], "Kafka");

    expect(screen.getByText("Keine Bücher gefunden für „Kafka“.")).toBeInTheDocument();
    expect(screen.queryByText("Keine Bücher in der Datenbank vorhanden.")).not.toBeInTheDocument();
  });
});
