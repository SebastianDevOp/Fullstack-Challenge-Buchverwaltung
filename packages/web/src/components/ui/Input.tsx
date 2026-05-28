type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: () => void;
  type?: "text";
  required?: boolean;
  error?: string;
};

export const Input = ({ label, value, onChange, required }: InputProps) => {
  return (
    <div className="input-container">
      <label htmlFor={label}>
        {`${label}: `}
        <input id={label} type="text" value={value} onChange={onChange} required={required} />
      </label>
    </div>
  );
};
