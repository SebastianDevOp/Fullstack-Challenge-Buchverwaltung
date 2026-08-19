import type { ApiBook } from "@/lib/booksApi";
import { BookCover } from "./BookCover";
import { DeleteIcon } from "./DeleteIcon";
import { EditIcon } from "./EditIcon";

// --- PROPS ---
type BooksTableProps = {
  books: ApiBook[];
  headers: string[];
  onDeleteClick: (book: ApiBook) => void;
  onUpdateClick: (book: ApiBook) => void;
};

export const Table = ({ books, headers, onDeleteClick, onUpdateClick }: BooksTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[36%]" />
            <col className="w-[28%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 context-menu">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((book: ApiBook) => {
              return (
                <tr key={book?.id} className="transition-colors duration-150 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <BookCover isbn={book.isbn} title={book.title} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {book?.title ?? "Unbekannter Titel"}
                  </td>
                  <td className="truncate px-6 py-4 text-sm text-gray-600" title={book.author}>
                    {book.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {book?.year ?? "Unbekanntes Jahr"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-1 whitespace-nowrap">
                    <EditIcon
                      onClick={() => {
                        onUpdateClick(book);
                      }}
                    />
                    <DeleteIcon onClick={() => onDeleteClick(book)} />
                  </td>
                </tr>
              );
            })}
            {books.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="p-12 text-center text-sm text-gray-400 italic"
                >
                  Keine Bücher in der Datenbank vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
