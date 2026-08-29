import * as React from "react";
import { classNames } from "~src/utils/helperFunctions";

type SectionWrapperProps = {
  paddingY?: "none" | "small" | "medium" | "large";
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const paddingClasses = {
  none: "",
  small: "py-10 sm:py-12",
  medium: "py-16 sm:py-24",
  large: "py-20 sm:py-32",
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  paddingY = "medium",
  children,
  className,
  id,
}) => (
  <section id={id} className={classNames(paddingClasses[paddingY], className)}>
    <div className="mx-auto max-w-site px-5 sm:px-10">{children}</div>
  </section>
);

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  tone?: "dark" | "light";
  action?: React.ReactNode;
  /** Draw the design's 2px rule under the heading row. */
  rule?: boolean;
};

/** Eyebrow + display heading used at the top of most sections. */
export const SectionHeading = ({
  eyebrow,
  title,
  tone = "light",
  action,
  rule,
}: SectionHeadingProps) => {
  const dark = tone === "dark";
  return (
    <div
      className={classNames(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10",
        rule && "border-b-2 border-ink pb-4"
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className={`eyebrow ${dark ? "text-amber" : "text-amber-dark"}`}>
            {eyebrow}
          </span>
        )}
        <h2 className={`display text-4xl sm:text-[54px] ${dark ? "text-bone" : "text-ink"}`}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
};
