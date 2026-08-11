import { describe, expect, it } from "vitest";
import { paramsSchema } from "./paramsSchema";

describe("paramsSchema", () => {
  it("nimmt bei leerer Eingabe die 1", () => {
    const result = paramsSchema.parse({
      q: "Harry",
    });
    expect(result.page).toBe(1);
  });

  it("nimmt bei 2 die 2 ", () => {
    const result = paramsSchema.parse({
      page: "2",
    });
    expect(result.page).toBe(2);
  });

  it("Obergrenze ist 999", () => {
    const result = paramsSchema.parse({
      page: "999",
    });
    expect(result.page).toBe(999);
  });

  it("nimmt bei einer Seite über der Obergrenze die 1", () => {
    const result = paramsSchema.parse({ page: "1000" });

    expect(result.page).toBe(1);
  });

  it("nimmt bei Text als Seitenzahl die 1", () => {
    const result = paramsSchema.parse({ page: "abc" });

    expect(result.page).toBe(1);
  });

  it("nimmt bei negativer Seitenzahl die 1", () => {
    const result = paramsSchema.parse({ page: "-5" });

    expect(result.page).toBe(1);
  });

  it("nimmt bei Seite 0 die 1", () => {
    const result = paramsSchema.parse({ page: "0" });

    expect(result.page).toBe(1);
  });

  it("nimmt bei einer Kommazahl die 1", () => {
    const result = paramsSchema.parse({ page: "1.7" });

    expect(result.page).toBe(1);
  });

  it("nimmt bei leerem Wert die 1", () => {
    const result = paramsSchema.parse({ page: "" });

    expect(result.page).toBe(1);
  });

  it("nimmt ohne Suchbegriff einen leeren Text", () => {
    const result = paramsSchema.parse({});

    expect(result.q).toBe("");
  });

  it("übernimmt den Suchbegriff", () => {
    const result = paramsSchema.parse({ q: "Steppenwolf" });

    expect(result.q).toBe("Steppenwolf");
  });

  it("verarbeitet Suchbegriff und Seitenzahl zusammen", () => {
    const result = paramsSchema.parse({ q: "Harry", page: "2" });

    expect(result.q).toBe("Harry");
    expect(result.page).toBe(2);
  });
});
