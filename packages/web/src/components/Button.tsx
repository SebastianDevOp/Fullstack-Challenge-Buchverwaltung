type ButtonProps = {
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: string;
};

export const Button = ({ variant, type, onClick, disabled, children }: ButtonProps) => {
  const primaryStyle = {
    color: "white",
    backgroundColor: " #007bff",
    border: "none",
    padding: "10 px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const dangerStyle = {
    color: "white",
    backgroundColor: "#dc3545",
    border: "none",
    padding: "10 px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const disabledStyle = {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  };

  const style = Object.assign(
    {},
    variant === "primary" ? primaryStyle : dangerStyle,
    disabled ? disabledStyle : {},
  );

  return (
    <button style={style} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
