import { authors, books, db } from "@book-manager/database/node";
import { FastMCP } from "@prefecthq/fastmcp-ts/server";
import { eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

const server = new FastMCP({
  name: "buchverwaltungs-mcp",
  version: "1.0.0",
});

const normalizeName = (value: string) => value.toLowerCase().replace(/[.\s]/g, "");

const normalizedAuthorName = sql`replace(replace(lower(${authors.name}), '.', ''), ' ', '')`;

server.tool({ name: "get_books", description: "Holt eine Liste aller Bücher" }, async () => {
  const result = await db
    .select({
      id: books.id,
      title: books.title,
      isbn: books.isbn,
      year: books.year,
      author: authors.name,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id));
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
      .select({
        id: books.id,
        title: books.title,
        isbn: books.isbn,
        year: books.year,
        author: authors.name,
      })
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
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
    const newBook = await db.transaction(async (tx) => {
      const authorRecords = await tx
        .select()
        .from(authors)
        .where(eq(normalizedAuthorName, normalizeName(authorName)))
        .limit(1);

      let currentAuthorId: number;

      if (authorRecords.length > 0) {
        currentAuthorId = authorRecords[0].id;
      } else {
        const [newAuthor] = await tx.insert(authors).values({ name: authorName }).returning();
        currentAuthorId = newAuthor.id;
      }

      const [created] = await tx
        .insert(books)
        .values({
          title,
          authorId: currentAuthorId,
          isbn: isbn?.trim() || null,
          year,
        })
        .returning();

      return created;
    });

    return JSON.stringify(newBook, null, 2);
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
  async (id) => {
    const [deleted] = await db.delete(books).where(eq(books.id, id)).returning();

    return JSON.stringify({ deleted: true, book: deleted }, null, 2);
  },
);

// server.tool({
//   name: "update_book",
//   description: "Ändert ein bereits bestehendes Buch",
//   input: z.object({
//       title: z.string().min(1).optional,
//       authorName: z.string().min(1).optional(),
//       isbn: z.string().optional(),
//       year: z.number().optional(),
//   })
// },
// async ({title, authorName, isbn, year}) => {

// }
// )

server.run().catch(console.error);
