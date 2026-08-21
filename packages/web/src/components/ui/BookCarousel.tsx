import type { OpenLibraryBook } from "@/hooks/useOpenLibrarySearch";
import { Button } from "./Button";

// --- PROPS ---
type BookCarouselProps = {
  suggestions: OpenLibraryBook[];
  isLoading: boolean;
  onAddClick: (book: OpenLibraryBook) => void;
};

export const BookCarousel = ({ suggestions, isLoading, onAddClick }: BookCarouselProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-1 text-lg font-semibold text-gray-900">Das könnte dir gefallen</h2>
      <p className="mb-4 text-sm text-gray-500">Weitere Werke der Autoren aus deiner Sammlung</p>

      {isLoading && <p className="py-8 text-sm text-gray-400 italic">Vorschläge werden geladen…</p>}

      {!isLoading && suggestions.length === 0 && (
        <p className="py-8 text-sm text-gray-400 italic">
          Momentan keine weiteren Vorschläge gefunden.
        </p>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {suggestions.map((book) => (
            <article
              key={book.key}
              className="flex w-40 shrink-0 snap-start flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              {/* biome-ignore lint/performance/noImgElement: Cover kommen von OpenLibrary*/}
              <img
                src={book.coverUrl}
                alt={`Cover von ${book.title}`}
                loading="lazy"
                className="mb-3 h-48 w-full rounded object-cover"
              />

              <div className="h-10 overflow-hidden">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900" title={book.title}>
                  {book.title}
                </h3>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                {book.authorName ?? "Unbekannter Autor"}
              </p>
              <p className="text-xs text-gray-400">{book.year ?? "—"}</p>

              <div className="mt-auto flex justify-center pt-3">
                <Button variant="primary" type="button" onClick={() => onAddClick(book)}>
                  Hinzufügen
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
