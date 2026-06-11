export type Author = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  title: string;
  authorId: number;
  isbn?: number;
  year?: number;
};

export type BookRow = {
  books: Book;
};
