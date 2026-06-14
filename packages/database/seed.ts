import { db, pool } from "./src/db.js";
import { authors, books } from "./src/schema.js";

const authorData = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "George Orwell" },
  { id: 3, name: "Jane Austen" },
  { id: 4, name: "Franz Kafka" },
  { id: 5, name: "Hermann Hesse" },
];

const bookData = [
  // J.K. Rowling (ID 1)
  {
    title: "Harry Potter und der Stein der Weisen",
    year: 1997,
    authorId: 1,
    isbn: "9783551551672",
  },
  {
    title: "Harry Potter und die Kammer des Schreckens",
    year: 1998,
    authorId: 1,
    isbn: "9783551551689",
  },

  // George Orwell (ID 2)
  { title: "1984", year: 1949, authorId: 2, isbn: "9783548225623" },
  { title: "Farm der Tiere", year: 1945, authorId: 2, isbn: "9783257201185" },

  // Jane Austen (ID 3)
  { title: "Stolz und Vorurteil", year: 1813, authorId: 3 },
  { title: "Emma", year: 1815, authorId: 3 },

  // Franz Kafka (ID 4)
  { title: "Die Verwandlung", year: 1915, authorId: 4 },
  { title: "Der Process", year: 1925, authorId: 4 },

  // Hermann Hesse (ID 5)
  { title: "Siddhartha", year: 1922, authorId: 5 },
  { title: "Der Steppenwolf", year: 1927, authorId: 5 },
];

async function main() {
  console.log("Cleaning database...");

  await db.delete(books);
  await db.delete(authors);

  console.log("Seeding authors...");

  for (const author of authorData) {
    await db
      .insert(authors)
      .values(author)
      .onConflictDoUpdate({
        target: authors.id,
        set: { name: author.name },
      });
  }

  console.log(`Seeded ${authorData.length} authors.`);

  console.log("Seeding books...");

  for (const book of bookData) {
    await db.insert(books).values(book);
  }
  console.log(`Seeded ${bookData.length} books.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
