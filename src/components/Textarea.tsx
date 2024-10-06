import * as React from "react";

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  variant?: "primary" | "secondary" | "accent" | "success";
  darkMode?: boolean;
  isDisabled?: boolean;
  id?: string;
  name?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  variant = "primary",
  darkMode = false,
  isDisabled = false,
  label,
  id,
  name,
}) => {
  const baseClasses =
    "block w-full rounded-md border-0 py-1.5 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6";

  const variantClasses = {
    primary: `${
      darkMode
        ? "bg-gray-700 text-white ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
        : "bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
    } focus:ring-gray-500`,
    secondary: `${
      darkMode
        ? "bg-yellow-600 text-white ring-1 ring-inset ring-yellow-300 focus:ring-2 focus:ring-inset"
        : "bg-yellow-200 text-yellow-900 ring-1 ring-inset ring-yellow-300 focus:ring-2 focus:ring-inset"
    } focus:ring-yellow-500`,
    accent: `${
      darkMode
        ? "bg-red-600 text-white ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
        : "bg-red-100 text-red-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
    } focus:ring-red-500`,
    success: `${
      darkMode
        ? "bg-green-700 text-white ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
        : "bg-green-100 text-green-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
    } focus:ring-green-500`,
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="mb-1 font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${baseClasses} ${variantClasses[variant]} ${
          isDisabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isDisabled}
      />
    </div>
  );
};
