import * as React from "react";

type BadgeVariant = "ink" | "amber" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  ink: "bg-ink text-bone",
  amber: "bg-amber text-ink",
  muted: "bg-sand text-mute",
};

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: BadgeVariant;
}> = ({ children, variant = "ink" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.16em] leading-none ${variantClasses[variant]}`}
  >
    {children}
  </span>
);
