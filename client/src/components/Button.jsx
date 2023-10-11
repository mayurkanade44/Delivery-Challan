const Button = ({
  label,
  onClick,
  type = "button",
  disabled,
  small,
  color,
  height,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        py-1
        m-1
        text-white
        ${height && height}
        ${color ? color : "bg-blue-500"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "px-2" : "px-4"}
        ${small ? "font-medium" : "font-semibold"}
      `}
    >
      {label}
    </button>
  );
};
export default Button;
