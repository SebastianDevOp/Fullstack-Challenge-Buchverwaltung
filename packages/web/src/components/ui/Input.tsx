import type { ComponentPropsWithoutRef } from "react";

// -- Props --
type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  name: string;
  error?: string;
};

export const Input = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text", // Default - Wert
  error,
  onBlur,
  ...restProps
}: InputProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          name={name}
          id={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder=" "
          {...restProps}
        />
        <label
          className="absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left 
          peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90 
          peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:scale-90"
          htmlFor={name}
        >{`${label}`}</label>
        {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
      </div>
    </div>
  );
};
