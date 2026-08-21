export type ApiBook = {
  id: number;
  title: string;
  isbn: string | null;
  year: number | null;
  author: string;
  authorId: number;
};

export type ApiAuthor = {
  id: number;
  name: string;
};

export type ApiBookPage = {
  data: ApiBook[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiBookInput = {
  title: string;
  authorId: number;
  isbn: string | null;
  year: number | null;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function apiBaseUrl(): string {
  const url = process.env.BOOKS_API_URL;
  if (!url) {
    throw new Error("BOOKS_API_URL is not set. Copy .env.example to .env and configure it.");
  }

  return url;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${apiBaseUrl()}${path}`, { cache: "no-store", ...init });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init?.method ?? "GET"} ${path} fehlgeschlagen (HTTP ${response.status})`,
    );
  }

  return response;
}

const jsonHeaders = { "Content-Type": "application/json" };

// Cache-Tags fuer die Lesepfade. Invalidiert werden sie in app/books/action.ts.
export const BOOKS_TAG = "books";
export const AUTHORS_TAG = "authors";

export async function fetchBooks({
  q,
  page,
  size,
}: {
  q?: string;
  page?: number;
  size?: number;
} = {}): Promise<ApiBookPage> {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  if (page) {
    params.set("page", String(page));
  }
  if (size) {
    params.set("size", String(size));
  }

  const response = await apiFetch(`/api/books?${params}`);
  const result: ApiBookPage = await response.json();

  return result;
}

export async function fetchAuthors(): Promise<ApiAuthor[]> {
  const response = await apiFetch("/api/authors", {
    cache: "force-cache",
    next: { tags: [AUTHORS_TAG] },
  });
  const result: ApiAuthor[] = await response.json();
  return result;
}

/**
 * Liefert nur die Titel aller Bücher – Grundlage für den Abgleich im Karussell.
 * Bewusst kein `fetchBooks`, damit weder vollständige Buch-Objekte noch der
 * Autoren-Join über die Leitung gehen.
 */
export async function fetchBookTitles(): Promise<string[]> {
  const response = await apiFetch("/api/books/titles", {
    cache: "force-cache",
    next: { tags: [BOOKS_TAG] },
  });
  const result: string[] = await response.json();

  return result;
}

export async function createBook(book: ApiBookInput) {
  await apiFetch("/api/books", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(book),
  });
}

export async function updateBook(bookId: number, book: ApiBookInput) {
  await apiFetch(`/api/books/${bookId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(book),
  });
}

export async function deleteBook(bookId: number) {
  await apiFetch(`/api/books/${bookId}`, { method: "DELETE" });
}

export async function createAuthor(name: string): Promise<ApiAuthor> {
  const response = await apiFetch("/api/authors", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name }),
  });
  const result: ApiAuthor = await response.json();

  return result;
}
