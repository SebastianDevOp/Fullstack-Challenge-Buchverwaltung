export const DeleteIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 active:scale-95"
      onClick={onClick}
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
  );
};
