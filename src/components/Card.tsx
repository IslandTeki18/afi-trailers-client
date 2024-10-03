import * as React from "react";

type CardProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const Card = (props: CardProps) => {
  return (
    <div
      className={`divide-y divide-gray-400 overflow-hidden rounded-lg bg-slate-200 shadow-lg ${props.className}`}
    >
      <div className="px-4 py-5 sm:px-6">{props.header}</div>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
      <div className="px-4 py-4 sm:px-6">{props.footer}</div>
    </div>
  );
};
