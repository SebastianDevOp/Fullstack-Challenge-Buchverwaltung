import { describe, expect, it } from "vitest";
import { bookSchema } from "./bookSchema";

describe("bookSchema", () => {
  it("übernimmt vollständige Angaben", () => {
    const result = bookSchema.parse({
      title: "Der Steppenwolf",
      authorId: "5",
      isbn: "8420666521",
      year: "1927",
    });

    expect(result.title).toBe("Der Steppenwolf");
    expect(result.authorId).toBe(5);
    expect(result.isbn).toBe("8420666521");
    expect(result.year).toBe(1927);
  });

  it("macht eine leere ISBN zu null", () => {
    const result = bookSchema.parse({
      title: "Testbuch 2",
      authorId: "5",
      isbn: "",
      year: "",
    });

    expect(result.isbn).toBeNull();
  });

  it("trimmt eine ISBN", () => {
    const result = bookSchema.parse({
      title: "Testbuch 3",
      authorId: "5",
      isbn: "  9854",
      year: "",
    });

    expect(result.isbn).toBe("9854");
  });

  it("macht aus einer ISBN mit Leerzeichen null", () => {
    const result = bookSchema.parse({
      title: "   Testbuch   ",
      authorId: "5",
    });

    expect(result.title).toBe("Testbuch");
  });

  it("garkein year angegeben", () => {
    const result = bookSchema.parse({
      title: "Testbuch 4",
      authorId: "5",
      isbn: "",
      year: null,
    });

    expect(result.year).toBeNull();
  });

  it("macht ein leeres year zu null", () => {
    const result = bookSchema.parse({
      title: "Testbuch 5",
      authorId: "5",
      isbn: "2345677",
    });

    expect(result.year).toBeNull();
  });

  it("lehnt leeren Titel ab ", () => {
    expect(() => bookSchema.parse({ title: "   ", authorId: "5" })).toThrow();
  });

  it("lehnt fehlenden Author ab", () => {
    expect(() => bookSchema.parse({ title: "Testbuch 6", authorId: "0" })).toThrow();
  });

  it("lehnt negativen Author ab", () => {
    expect(() => bookSchema.parse({ title: "Testbuch 6", authorId: "-1" })).toThrow();
  });

  it("lehnt Buchstaben aus AuthorId anb", () => {
    expect(() => bookSchema.parse({ title: "Testbuch 7", authorId: "abc" })).toThrow();
  });

  it("lehnt negatives Jahr ab", () => {
    expect(() => bookSchema.parse({ title: "Testbuch 8", authorId: "5", year: "-223" })).toThrow();
  });

  it("lehnt Kommzahlen als Jahr ab", () => {
    expect(() => bookSchema.parse({ title: "Testbuch 9", authorId: "5", year: "1,89" })).toThrow();
  });

  it("lehnt Buchstaben als Jahr ab", () => {
    expect(() => bookSchema.parse({ title: " Testbuch 9", authorId: "5", year: "abc" })).toThrow();
  });
});
