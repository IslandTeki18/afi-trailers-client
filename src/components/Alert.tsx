import * as React from "react";

type AlertVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface AlertProps {
  children?: React.ReactNode;
  variant?: AlertVariant;
  onClose?: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "primary",
  onClose,
  title,
  message,
  icon,
}) => {
  const baseClasses = "p-4 rounded-md";

  const variantClasses: Record<AlertVariant, string> = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900",
    success:
      "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
    danger: "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
    info: "bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
      <div className="flex">
        {icon && <div className="mr-3">{icon}</div>}
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
