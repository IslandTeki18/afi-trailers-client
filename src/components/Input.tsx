import * as React from "react";
import { classNames } from "~src/utils/helperFunctions";

export const fieldClasses =
  "w-full border border-rule-2 bg-field px-3.5 py-3 text-base text-ink placeholder:text-mute-3 focus:border-ink focus:ring-0 disabled:bg-bone-4 disabled:text-mute-6 disabled:cursor-not-allowed";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  className = "",
  id,
  ...props
}) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label htmlFor={id} className="label-caps">
        {label}
        {hint && <span className="text-mute-5"> ({hint})</span>}
      </label>
    )}
    <input id={id} className={classNames(fieldClasses, className)} {...props} />
  </div>
);
