import { revalidatePath, updateTag } from "next/cache";
import { describe, expect, it, vi } from "vitest";
import { ApiError, BOOKS_TAG, createBook, updateBook } from "@/lib/booksApi";
import { createBookAction, updateBookAction } from "./action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

vi.mock("@/lib/booksApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/booksApi")>();
  return { ...actual, createBook: vi.fn(), updateBook: vi.fn() };
});

describe("action", () => {
  it("409 beim Anlegen wird abgebildet", async () => {
    vi.mocked(createBook).mockRejectedValue(new ApiError(409, "konflikt"));
    const result = await createBookAction({ title: "Testbuch", authorId: 1, isbn: "", year: "" });
    expect(result).toEqual({ error: "duplicate-isbn" });
  });

  it("409 beim Aktualisieren wird abgebildet", async () => {
    vi.mocked(updateBook).mockRejectedValue(new ApiError(409, "konflikt"));
    const result = await updateBookAction({
      title: "Testbuch",
      id: 1,
      authorId: 1,
      isbn: "",
      year: "",
    });
    expect(result).toEqual({ error: "duplicate-isbn" });
  });

  it("Andere Fehler werden nicht als Dublette behandelt", async () => {
    vi.mocked(createBook).mockRejectedValue(new ApiError(500, "serverfehler"));
    await expect(
      createBookAction({ title: "Testbuch", authorId: 1, isbn: "", year: "" }),
    ).rejects.toThrow(ApiError);
  });

  it("Erfolgsfall gibt nichts zurück", async () => {
    vi.mocked(createBook).mockResolvedValue(undefined);
    const result = await createBookAction({ title: "Testbuch", authorId: 1, isbn: "", year: "" });
    expect(result).toBeUndefined();
    expect(vi.mocked(updateTag)).toHaveBeenCalledWith(BOOKS_TAG);
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/books");
  });
});
