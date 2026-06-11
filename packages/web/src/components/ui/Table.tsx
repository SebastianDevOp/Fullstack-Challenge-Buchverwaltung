import type { Book } from "@/types/models";

type BooksTableProps = {
  books: Book[];
  headers: string[];
  onDeleteClick: (book: Book) => void;
  getAuthorName: (authorID: number) => string;
};

export const Table = ({ books, headers, onDeleteClick, getAuthorName }: BooksTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm mt-6 ">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto min-w-max border-collapse">
          <thead>
            <tr className="bg-blue-50/50 border-b border-blue-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="p-4 text-xs font-semibold uppercase tracking-wider text-blue-600/80"
                >
                  {header}
                </th>
              ))}
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-blue-600/80 text-right">
                Aktionen
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {books.map((book: Book) => {
              const authorName = getAuthorName(book.authorId);

              return (
                <tr key={book.id} className="transition-colors duration-150 hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-medium text-gray-900">{book.title}</td>
                  <td className="p-4 text-sm text-gray-600">{authorName}</td>
                  <td className="p-4 text-sm text-gray-500">{book.year || "—"}</td>
                  <td className="p-4 text-sm text-right">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      onClick={() => onDeleteClick(book)}
                      title="Buch löschen"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
