import type { Book } from "@/types/models";
import { DeleteIcon } from "./DeleteIcon";
import { EditIcon } from "./EditIcon";

// --- PROPS ---
type BooksTableProps = {
  books: Book[];
  headers: string[];
  onDeleteClick: (book: Book) => void;
  onUpdateClick: (book: Book) => void;
  getAuthorName: (authorID: number) => string;
};

export const Table = ({
  books,
  headers,
  onDeleteClick,
  onUpdateClick,
  getAuthorName,
}: BooksTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-fixed border-collapse text-left">
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
            {books.map((book: Book) => {
              const currentAuthorId = book?.authorId ?? 0;
              const authorName = getAuthorName(currentAuthorId);

              return (
                <tr
                  key={book?.id ?? Math.random()}
                  className="transition-colors duration-150 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                    {book?.title ?? "Unbekannter Titel"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {authorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
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
