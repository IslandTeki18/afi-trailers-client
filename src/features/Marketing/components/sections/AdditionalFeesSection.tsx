import * as React from "react";
import { Card } from "~src/components";
import { formatMoney } from "~src/utils";

export type Fee = {
  name: string;
  amount: number | string;
  description: string;
};

export const additionalFees: Fee[] = [
  {
    name: "Late return",
    amount: 50,
    description: "Self service only, per day past the agreed date",
  },
  {
    name: "Returned dirty",
    amount: 50,
    description: "Non-refundable cleaning charge",
  },
  {
    name: "Prohibited items in the load",
    amount: "At cost",
    description: "Disposal cost plus denial of future service",
  },
  {
    name: "Damage deposit",
    amount: 0,
    description: "Not collected up front — we trust you",
  },
];

/** "If the rules are broken" fee table. Rendered inside a page section by the caller. */
export const AdditionalFeesSection = ({
  title = "If the rules are broken",
}: {
  title?: string;
}) => (
  <Card variant="ink" header={title} padded={false}>
    {additionalFees.map((fee, i) => (
      <div
        key={fee.name}
        className={`flex items-baseline justify-between gap-6 px-6 py-4 ${
          i < additionalFees.length - 1 ? "border-b border-bone-3" : ""
        }`}
      >
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[17px] leading-none text-ink">
            {fee.name}
          </span>
          <span className="text-sm leading-snug text-mute">{fee.description}</span>
        </div>
        <span className="font-display font-bold text-[28px] leading-none text-ink whitespace-nowrap">
          {typeof fee.amount === "number" ? formatMoney(fee.amount) : fee.amount}
        </span>
      </div>
    ))}
  </Card>
);
