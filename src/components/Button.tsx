import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "success" | "warning";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  size = "medium",
  ...props
}) => {
  const buttonSizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const baseClasses = `rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${buttonSizeClasses[size]}`;

  const variantClasses = {
    primary:
      "bg-gray-800 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700",
    secondary:
      "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-600",
    accent:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    success:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
