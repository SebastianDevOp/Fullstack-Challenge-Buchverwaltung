import { authors, books, db } from "@book-manager/database/node";
import { FastMCP } from "@prefecthq/fastmcp-ts/server";
import { ilike } from "drizzle-orm";
import { z } from "zod";

const server = new FastMCP({
  name: "buchverwaltungs-mcp",
  version: "1.0.0",
});

server.tool({ name: "get_books", description: "Holt eine Liste aller Bücher" }, async () => {
  const result = await db.select().from(books);
  return JSON.stringify(result, null, 2);
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
    const result = await db
      .select()
      .from(books)
      .where(ilike(books.title, `%${args.suchbegriff}%`));
    return JSON.stringify(result, null, 2);
  },
);

server.tool(
  {
    name: "get_authors",
    description: "Holt eine Liste aller Autoren",
  },
  async () => {
    const result = await db.select().from(authors);
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
    const authorRecords = await db
      .select()
      .from(authors)
      .where(ilike(authors.name, authorName))
      .limit(1);

    let currentAuthorId: number;

    if (authorRecords.length > 0) {
      currentAuthorId = authorRecords[0].id;
    } else {
      const [newAuthor] = await db.insert(authors).values({ name: authorName }).returning();
      currentAuthorId = newAuthor.id;
    }

    const [newBook] = await db
      .insert(books)
      .values({
        title,
        authorId: currentAuthorId,
        isbn,
        year,
      })
      .returning();

    return JSON.stringify(newBook, null, 2);
  },
);

server.run().catch(console.error);
