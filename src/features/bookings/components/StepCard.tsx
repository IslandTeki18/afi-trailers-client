import * as React from "react";
import { Card } from "~src/components";

export const StepCard = ({
  n,
  title,
  right,
  children,
}: {
  n: number;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card
    header={
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-ink text-bone font-bold text-[13px] leading-6 text-center">
            {n}
          </span>
          <span className="font-semibold text-[13px] uppercase tracking-[0.18em] text-ink">
            {title}
          </span>
        </div>
        {right}
      </div>
    }
  >
    {children}
  </Card>
);
