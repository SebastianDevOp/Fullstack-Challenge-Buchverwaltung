import type { Book } from "@/types/models";

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
    <div className=" w-full overflow-hidden rounded-l border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-fixed border-collapse text-left">
          <thead className="">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="text-s font-semibold uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
              <th className="text-right text-s font-semibold uppercase tracking-wider text-gray-500">
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
                  className="transition-colors hover:bg-gray-50/40"
                >
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {book?.title ?? "Unbekannter Titel"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{authorName}</td>
                  <td className="p-4 text-sm text-gray-500">{book?.year ?? "Unbekanntes Jahr"}</td>
                  <td className="p-4 text-right text-sm space-x-1">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                      onClick={() => onUpdateClick(book)}
                      title="Buch bearbeiten"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                      onClick={() => onDeleteClick(book)}
                      title="Buch löschen"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
            {books.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="p-8 text-center text-sm text-gray-400 italic"
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
