import * as React from "react";
import { Link } from "react-router-dom";
import { classNames } from "~src/utils/helperFunctions";

export type ButtonVariant =
  | "primary" // ink fill
  | "amber" // amber fill, the site's main CTA
  | "outline" // ink outline on light backgrounds
  | "outline-light"; // pale outline on dark backgrounds

export type ButtonSize = "small" | "medium" | "large";

const sizeClasses: Record<ButtonSize, string> = {
  small: "px-4 py-3 text-[13px]",
  medium: "px-6 py-4 text-[14px]",
  large: "px-8 py-5 text-[15px]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-bone hover:bg-ink-2 disabled:bg-mute-3 disabled:cursor-not-allowed",
  amber:
    "bg-amber text-ink hover:bg-amber-mid disabled:bg-mute-5 disabled:cursor-not-allowed",
  outline:
    "border-2 border-ink text-ink hover:bg-ink hover:text-bone disabled:opacity-50 disabled:cursor-not-allowed",
  "outline-light":
    "border border-body-3 text-bone hover:border-bone disabled:opacity-50 disabled:cursor-not-allowed",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "medium",
  className = ""
) {
  return classNames(
    "inline-flex items-center justify-center text-center font-bold uppercase tracking-[0.14em] leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
    sizeClasses[size],
    variantClasses[variant],
    className
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={buttonClasses(variant, size, className)}
    {...props}
  >
    {children}
  </button>
);

type ButtonLinkProps = {
  to: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** Router link styled as a button. Use a plain <a> with buttonClasses() for tel:/mailto: links. */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  to,
  children,
  variant = "primary",
  size = "medium",
  className = "",
}) => (
  <Link to={to} className={buttonClasses(variant, size, className)}>
    {children}
  </Link>
);
