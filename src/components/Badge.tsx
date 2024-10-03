import * as React from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variantClasses: Record<BadgeVariant, string> = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-800",
    success:
      "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
    danger: "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
    info: "bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
