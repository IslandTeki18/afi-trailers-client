import * as React from "react";
import { classNames } from "~src/utils/helperFunctions";

type CardProps = {
  /** Rendered in the card's title bar. Strings get the uppercase label treatment. */
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** "paper": light card with hairline border. "ink": dark title bar and 2px ink frame. */
  variant?: "paper" | "ink";
  padded?: boolean;
};

export const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  className = "",
  variant = "paper",
  padded = true,
}) => {
  const ink = variant === "ink";
  return (
    <div
      className={classNames(
        "bg-paper",
        ink ? "border-2 border-ink" : "border border-rule",
        className
      )}
    >
      {header && (
        <div
          className={classNames(
            "px-6 py-4",
            ink ? "bg-ink text-bone" : "border-b border-rule text-ink"
          )}
        >
          {typeof header === "string" ? (
            <span className="font-semibold text-xs uppercase tracking-[0.2em]">
              {header}
            </span>
          ) : (
            header
          )}
        </div>
      )}
      <div className={padded ? "px-6 py-6" : ""}>{children}</div>
      {footer && <div className="px-6 py-4 border-t border-rule">{footer}</div>}
    </div>
  );
};
