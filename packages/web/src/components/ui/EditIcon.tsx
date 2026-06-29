export const EditIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      {" "}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 active:scale-95"
        onClick={onClick}
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
    </>
  );
};
