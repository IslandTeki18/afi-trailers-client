import * as React from "react";
import { useState } from "react";

type FAQItemProps = {
  title: string;
  children: React.ReactNode;
};

export const FAQItem = (props: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-rule">
      <button
        type="button"
        aria-expanded={isOpen}
        className="flex items-center justify-between gap-6 w-full py-5 text-left focus:outline-none focus-visible:text-amber-dark"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="display normal-case text-xl sm:text-2xl text-ink">
          {props.title}
        </span>
        <span className="font-display font-bold text-2xl leading-none text-amber-dark">
          {isOpen ? "–" : "+"}
        </span>
      </button>
      {isOpen && (
        <p className="pb-6 max-w-3xl text-base leading-relaxed text-body-2">
          {props.children}
        </p>
      )}
    </div>
  );
};
