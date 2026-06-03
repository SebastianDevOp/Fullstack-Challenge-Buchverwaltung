type SelectProps = {
  label: string;
  name: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
};

export const Select = ({ label, name, value, onChange, required, options }: SelectProps) => {
  return (
    <div className="w-full ">
      <select
        className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        name={name}
        id={name}
        value={value ? value : ""}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled>
          {`Wähle ${label}`}
        </option>

        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
