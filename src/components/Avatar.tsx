import * as React from "react";

type AvatarVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface AvatarProps {
  src?: string;
  alt: string;
  variant?: AvatarVariant;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full overflow-hidden";

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 text-base",
  };

  const variantClasses: Record<AvatarVariant, string> = {
    primary: "bg-blue-500 text-white dark:bg-blue-600",
    secondary: "bg-gray-500 text-white dark:bg-gray-600",
    success: "bg-green-500 text-white dark:bg-green-600",
    danger: "bg-red-500 text-white dark:bg-red-600",
    warning: "bg-yellow-500 text-white dark:bg-yellow-600",
    info: "bg-indigo-500 text-white dark:bg-indigo-600",
  };

  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const initialSize =
    size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-2xl";

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className={`${initialSize} tracking-widest`}>{initials}</span>
      )}
    </div>
  );
};
