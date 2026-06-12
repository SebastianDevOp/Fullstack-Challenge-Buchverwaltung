import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant: "primary" | "danger";
};

const BASE_STYLE =
  "font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200";

const VARIANT_STYLES = {
  primary:
    "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80",
  danger:
    "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80",
};

const DISABLED_STYLE =
  "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed";

export const Button = ({ variant, type, disabled, children, ...prop }: ButtonProps) => {
  const buttonStyle = `${BASE_STYLE} ${disabled ? DISABLED_STYLE : VARIANT_STYLES[variant]}`;

  return (
    <button className={buttonStyle} type={type} disabled={disabled} {...prop}>
      {children}
    </button>
  );
};
