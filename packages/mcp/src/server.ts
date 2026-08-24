import { FastMCP } from "@prefecthq/fastmcp-ts/server";
import { z } from "zod";
import {
  ApiError,
  createAuthor,
  createBook,
  deleteBook,
  fetchAuthors,
  fetchBooks,
} from "./bookApi";

const server = new FastMCP({
  name: "buchverwaltungs-mcp",
  version: "1.0.0",
});

server.tool({ name: "get_books", description: "Holt die Bücherliste, maximal 200" }, async () => {
  const result = await fetchBooks({ size: 200 });
  return JSON.stringify(result.data, null, 2);
});

server.tool(
  {
    name: "search_books",
    description: "Sucht nach Büchern anhand eines Suchbegriffes",
    input: z.object({
      suchbegriff: z.string(),
    }),
  },
  async (args) => {
    const result = await fetchBooks({ q: args.suchbegriff, size: 200 });
    return JSON.stringify(result.data, null, 2);
  },
);

server.tool(
  {
    name: "get_authors",
    description: "Holt eine Liste aller Autoren",
  },
  async () => {
    const result = await fetchAuthors();
    return JSON.stringify(result, null, 2);
  },
);

server.tool(
  {
    name: "add_book",
    description:
      "Fügt ein Buch zur Liste hinzu. Legt zusätzlich einen Author an falls keiner vorhanden ist.",
    input: z.object({
      title: z.string().min(1),
      authorName: z.string().min(1),
      isbn: z.string().optional(),
      year: z.number().optional(),
    }),
  },
  async ({ title, authorName, isbn, year }) => {
    const author = await createAuthor(authorName);

    try {
      const newBook = await createBook({
        title,
        authorId: author.id,
        isbn: isbn?.trim() || null,
        year: year ?? null,
      });
      return JSON.stringify(newBook, null, 2);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        return JSON.stringify(
          { created: false, message: "Ein Buch mit dieser ISBN existiert bereits." },
          null,
          2,
        );
      }

      throw error;
    }
  },
);

server.tool(
  {
    name: "delete_book",
    description: "Löscht ein Buch anhand seiner Id.",
    input: z.object({
      id: z.number().int().positive(),
    }),
  },
  async ({ id }) => {
    const deleted = await deleteBook(id);

    if (!deleted) {
      return JSON.stringify(
        { deleted: false, message: `Kein Buch mit ID ${id} gefunden.` },
        null,
        2,
      );
    }

    return JSON.stringify({ deleted: true });
  },
);

server.run().catch(console.error);
