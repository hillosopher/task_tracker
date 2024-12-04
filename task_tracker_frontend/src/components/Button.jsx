function Button({ children, onClick, buttonType = "primary" }) {
  const baseStyles = "text-white font-bold py-2 px-4 rounded";
  const buttonTypeStyles = {
    primary: "bg-blue-500 hover:bg-blue-700",
    alert: "bg-red-500 hover:bg-red-700",
    success: "bg-green-500 hover:bg-green-700",
  };
  const buttonClasses = `${baseStyles} ${buttonTypeStyles[buttonType]}`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
