import * as React from "react";

type SectionWrapperProps = {
  paddingY?: "small" | "medium" | "large";
  children: React.ReactNode;
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  paddingY = "medium",
  children,
}) => {
  function sectionPadding(paddingY: string) {
    switch (paddingY) {
      case "small":
        return "py-12 sm:py-16";
      case "medium":
        return "py-24 sm:py-32";
      case "large":
        return "py-32 sm:py-40";
      default:
        return "py-24 sm:py-32";
    }
  }
  return (
    <section className={`${sectionPadding(paddingY)}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
};
