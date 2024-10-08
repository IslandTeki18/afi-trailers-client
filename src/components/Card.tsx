import * as React from "react";

type CardVariant = "primary" | "secondary" | "accent" | "neutral" | "dark-primary";

type CardProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  primary: "bg-gray-200 dark:bg-gray-300 divide-gray-400 ",
  secondary: "bg-yellow-200 dark:bg-yellow-300 divide-yellow-400",
  accent: "bg-red-200 dark:bg-red-300 divide-red-400",
  neutral: "bg-slate-200 dark:bg-slate-300 divide-slate-400",
  "dark-primary": "bg-gray-900 dark:bg-gray-800 divide-gray-800",
};

export const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  className = "",
  variant = "primary",
}) => {
  return (
    <div
      className={`divide-y overflow-hidden rounded-lg shadow-lg ${
        variantClasses[variant]
      } ${className ? className : ""}`}
    >
      {header && <div className="px-4 py-5 sm:px-6">{header}</div>}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && <div className="px-4 py-4 sm:px-6">{footer}</div>}
    </div>
  );
};
