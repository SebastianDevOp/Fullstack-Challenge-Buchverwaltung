export type ApiBook = {
  id: number;
  title: string;
  isbn: string | null;
  year: number | null;
  author: string;
};

export type ApiBookPage = {
  data: ApiBook[];
  page: number;
  pageSize: number;
  total: number;
};

function apiBaseUrl(): string {
  const url = process.env.BOOKS_API_URL;
  if (!url) {
    throw new Error("BOOKS_API_URL is not set. Copy .env.example to .env and configure it.");
  }

  return url;
}

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
    params.set("q", `${q}`);
  }
  if (page) {
    params.set("page", `${page}`);
  }
  if (size) {
    params.set("size", `${size}`);
  }

  const response = await fetch(`${apiBaseUrl()}/api/books?${params}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  const result: ApiBookPage = await response.json();

  return result;
}
