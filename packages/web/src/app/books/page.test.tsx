import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BooksPage from "./page";

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (String(url).includes("/api/books")) {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, title: "Test-Buch", author: { name: "Autor" } }])),
      );
    }
    return Promise.resolve(new Response(JSON.stringify([])));
  }) as typeof fetch;
});

describe("BooksPage", () => {
  it("zeigt Bücher aus der API an", async () => {
    render(<BooksPage />);
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });
  it("");
});
