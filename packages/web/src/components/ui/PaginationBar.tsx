import { Button } from "./Button";

// --- PROPS ---
type PaginationBarProps = {
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  totalCount: number;
  totalPages: number;
};

export const PaginationBar = ({
  handlePageChange,
  currentPage,
  totalCount,
  totalPages,
}: PaginationBarProps) => {
  console.log("--- DEBUGGING PAGINATION ---");
  console.log("Wert currentPage:", currentPage);
  console.log("Typ currentPage:", typeof currentPage);
  console.log("Wert totalPages:", totalPages);
  console.log("Typ totalPages:", typeof totalPages);
  console.log("----------------------------");
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Zurück
        </Button>
        <Button
          variant="primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Weiter
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Zeige Seite <span className="font-medium">{currentPage}</span> von{" "}
            <span className="font-medium">{totalPages || 1}</span> (Gesamt: {totalCount} Bücher)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Zurück
          </Button>
          <Button
            variant="primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
};
