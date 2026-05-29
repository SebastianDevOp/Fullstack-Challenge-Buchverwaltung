type ButtonProps = {
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const Button = ({ variant, type, onClick, disabled, children }: ButtonProps) => {
  const primaryStyle =
    "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5";

  const dangerStyle =
    "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5";

  const disabledStyle =
    "text-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5";

  const basisStyle = variant === "primary" ? primaryStyle : dangerStyle;
  const finalStyle = disabled ? disabledStyle : basisStyle;

  return (
    <button className={finalStyle} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
