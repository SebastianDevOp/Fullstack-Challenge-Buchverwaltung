export const OPEN_LIBRARY_FIELDS = "key,title,author_name,first_publish_year,isbn,cover_i";

export type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
};

export type OpenLibraryResponse = {
  docs: OpenLibraryDoc[];
};
