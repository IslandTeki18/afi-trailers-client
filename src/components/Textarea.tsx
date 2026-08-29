import * as React from "react";
import { fieldClasses } from "./Input";
import { classNames } from "~src/utils/helperFunctions";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  rows = 4,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="label-caps">
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      className={classNames(fieldClasses, "leading-relaxed", className)}
      {...props}
    />
  </div>
);
