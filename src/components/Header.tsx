import * as React from "react";

type HeaderProps = {
  subTitle: string;
  title: string;
  description: string;
  /** Dark band (ink) or light (bone). */
  tone?: "dark" | "light";
  aside?: React.ReactNode;
};

/** Page-level header band. */
export const Header = ({
  subTitle,
  title,
  description,
  tone = "dark",
  aside,
}: HeaderProps) => {
  const dark = tone === "dark";
  return (
    <div className={dark ? "bg-ink" : "bg-bone border-b-2 border-ink"}>
      <div className="mx-auto max-w-site px-5 sm:px-10 py-14 sm:py-16 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
        <div className="flex flex-col gap-4">
          <span className={`eyebrow ${dark ? "text-amber" : "text-amber-dark"}`}>
            {subTitle}
          </span>
          <h1
            className={`display text-5xl sm:text-7xl ${
              dark ? "text-bone" : "text-ink"
            }`}
          >
            {title}
          </h1>
          <p
            className={`max-w-2xl text-lg leading-relaxed ${
              dark ? "text-mute-3" : "text-body-2"
            }`}
          >
            {description}
          </p>
        </div>
        {aside}
      </div>
    </div>
  );
};
