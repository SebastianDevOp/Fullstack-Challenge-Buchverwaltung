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
    throw new Error(`${init?.method ?? "GET"} ${path} fehlgeschlagen (HTTP ${response.status})`);
  }

  return response;
}

const jsonHeaders = { "Content-Type": "application/json" };

export async function fetchBooks({
  q,
  size,
}: {
  q?: string;
  size?: number;
} = {}): Promise<ApiBookPage> {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }

  if (size) {
    params.set("size", String(size));
  }

  const response = await apiFetch(`/api/books?${params}`);
  const result: ApiBookPage = await response.json();

  return result;
}

export async function fetchAuthors(): Promise<ApiAuthor[]> {
  const response = await apiFetch("/api/authors");
  const result: ApiAuthor[] = await response.json();
  return result;
}

export async function createBook(book: ApiBookInput): Promise<ApiBook> {
  const response = await apiFetch("/api/books", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(book),
  });
  const result: ApiBook = await response.json();

  return result;
}

export async function deleteBook(bookId: number): Promise<boolean> {
  const path = `/api/books/${bookId}`;
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error(`DELETE ${path} fehlgeschlagen (HTTP ${response.status})`);
  }

  return true;
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
