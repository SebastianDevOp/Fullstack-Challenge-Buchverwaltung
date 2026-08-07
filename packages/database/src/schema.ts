import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isbn: text("isbn").unique(),
  year: integer("year"),
  authorId: integer("authorId")
    .references(() => authors.id)
    .notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
