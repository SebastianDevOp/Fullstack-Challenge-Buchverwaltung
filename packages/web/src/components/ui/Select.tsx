type SelectProps = {
  label: string;
  name: string;
  value: number;
  onChange: () => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
};

export const Select = ({ label, name, value, onChange, required, options }: SelectProps) => {
  return (
    <div className="select-container">
      <label htmlFor={label}>
        {`${label}: `}
        <select name={name} id={label} value={value} onChange={onChange} required={required}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
