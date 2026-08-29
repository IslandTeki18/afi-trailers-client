import * as React from "react";
import { Trailer } from "~src/types";
import { formatMoney } from "~src/utils";

/** Posted-rates grid (Period / Self / Full) from the design's spec-sheet direction. */
export const PostedRatesTable = ({ trailer }: { trailer: Trailer }) => {
  const { halfDay, fullDay } = trailer.rentalPrices;
  const delivery = trailer.deliveryFee;
  const rows: { period: string; self: string; full: string; highlight?: boolean }[] = [
    ...(halfDay
      ? [{ period: "Half day · 5 hr", self: formatMoney(halfDay), full: formatMoney(halfDay + delivery) }]
      : []),
    { period: "Full day · 24 hr", self: formatMoney(fullDay), full: formatMoney(fullDay + delivery), highlight: true },
    { period: "Delivery fee", self: "—", full: formatMoney(delivery) },
  ];
  const footnotes = [
    "No deposit",
    trailer.weekendSurcharge && `Weekend surcharge ${formatMoney(trailer.weekendSurcharge)}`,
  ].filter(Boolean);

  const cell = "px-4 sm:px-5 py-4 border-b border-rule";
  const head = `${cell} font-semibold text-[11px] uppercase tracking-[0.16em] text-mute`;

  return (
    <div className="border-2 border-ink bg-paper">
      <div className="bg-ink text-bone px-5 py-3.5 font-semibold text-xs uppercase tracking-[0.2em]">
        Posted rates — {trailer.shortName} trailer
      </div>
      <div className="grid grid-cols-3">
        <div className={head}>Period</div>
        <div className={`${head} border-l`}>Self</div>
        <div className={`${head} border-l`}>Full</div>
        {rows.map((row, i) => {
          const last = i === rows.length - 1;
          const bg = row.highlight ? "bg-cream" : "";
          const c = `${cell} ${bg} ${last ? "border-b-0" : ""}`;
          return (
            <React.Fragment key={row.period}>
              <div className={`${c} font-medium text-base text-ink`}>{row.period}</div>
              <div className={`${c} border-l font-display font-bold text-[26px] leading-none ${row.self === "—" ? "text-mute-3" : "text-ink"}`}>
                {row.self}
              </div>
              <div className={`${c} border-l font-display font-bold text-[26px] leading-none text-ink`}>
                {row.full}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="border-t border-rule bg-field px-5 py-3.5 text-xs font-medium uppercase tracking-[0.08em] leading-relaxed text-mute">
        {footnotes.join(" · ")}
      </div>
    </div>
  );
};
