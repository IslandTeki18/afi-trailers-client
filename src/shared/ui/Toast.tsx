import * as React from "react";
import { useState, useEffect, useCallback } from "react";

type ToastVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  id?: number;
  createdAt?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "primary",
  duration = 3000,
  onClose,
  createdAt = Date.now(),
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseClasses = "p-4 rounded-md shadow-lg w-full max-w-sm";

  const variantClasses: Record<ToastVariant, string> = {
    primary: "bg-blue-500 text-white dark:bg-blue-600",
    secondary: "bg-gray-500 text-white dark:bg-gray-600",
    success: "bg-green-500 text-white dark:bg-green-600",
    danger: "bg-red-500 text-white dark:bg-red-600",
    warning: "bg-yellow-500 text-white dark:bg-yellow-600",
    info: "bg-indigo-500 text-white dark:bg-indigo-600",
  };

  const animationClasses = `
    transform transition-all duration-500 ease-in-out
    ${isVisible && !isLeaving ? "translate-y-0 opacity-100" : ""}
    ${!isVisible && !isLeaving ? "-translate-y-full opacity-0" : ""}
    ${isLeaving ? "-translate-x-full opacity-0" : ""}
  `;

  const updateProgress = useCallback(() => {
    const elapsedTime = Date.now() - createdAt;
    const newProgress = Math.min(elapsedTime / duration, 1);
    setProgress(newProgress);

    if (newProgress >= 1) {
      handleClose();
    }
  }, [createdAt, duration]);

  useEffect(() => {
    const timer = setInterval(updateProgress, 100);
    return () => clearInterval(timer);
  }, [updateProgress]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div>{message}</div>
        <button
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
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
      </div>
      <div className="mt-2 w-full bg-white bg-opacity-30 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${(1 - progress) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
