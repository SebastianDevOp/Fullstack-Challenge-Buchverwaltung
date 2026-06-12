import type { ComponentPropsWithoutRef } from "react";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  options: { value: string | number; label: string }[];
};

export const Select = ({
  label,
  name,
  value,
  onChange,
  required,
  options,
  ...props
}: SelectProps) => {
  return (
    <div className="w-full ">
      <select
        className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        name={name}
        id={name}
        value={value ? value : ""}
        onChange={onChange}
        required={required}
        {...props}
      >
        <option value="" disabled>
          {`Wähle ${label}`}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
