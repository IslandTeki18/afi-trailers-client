import * as React from "react";
import { SectionWrapper, SectionHeading } from "~src/components";
import { trailers } from "~src/data/trailers";
import { formatMoney } from "~src/utils";

export const selfServiceSteps = [
  "You pick up the trailer",
  "You fill the trailer",
  "You dump the trailer",
  "You return the trailer",
  "We clean the trailer",
];

export const fullServiceSteps = [
  "We deliver the trailer",
  "You fill the trailer",
  "We pick up the trailer",
  "We dump the trailer",
  "We clean the trailer",
];

const DashList = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-[15px] text-rule-2">
        <span className="text-amber">—</span>
        {item}
      </li>
    ))}
  </ul>
);

type ServicePanelProps = {
  title: string;
  rate: number;
  blurb: string;
  steps: string[];
  footnote: string;
  shaded?: boolean;
};

const ServicePanel = ({ title, rate, blurb, steps, footnote, shaded }: ServicePanelProps) => (
  <div
    className={`p-7 sm:p-11 flex flex-col gap-5 ${
      shaded ? "bg-ink-2" : "lg:border-r border-ink-rule"
    }`}
  >
    <div className="flex items-baseline justify-between gap-4">
      <h3 className="display text-[34px] text-bone">{title}</h3>
      <span className="font-display font-bold text-[38px] leading-none text-amber">
        {formatMoney(rate)}
        <span className="font-sans font-medium text-sm text-mute-3">/day</span>
      </span>
    </div>
    <p className="text-base leading-relaxed text-mute-3">{blurb}</p>
    <DashList items={steps} />
    <div className="text-xs font-medium uppercase tracking-[0.1em] leading-relaxed text-mute-4 border-t border-ink-rule pt-4">
      {footnote}
    </div>
  </div>
);

export const ServicesSection = () => {
  const t = trailers[0];
  const { fullDay, halfDay } = t.rentalPrices;
  return (
    <SectionWrapper className="bg-ink">
      <SectionHeading eyebrow="Services" title="You haul it, or we handle it" tone="dark" />
      <div className="grid lg:grid-cols-2 border border-ink-rule">
        <ServicePanel
          title="Self service"
          rate={fullDay}
          blurb={`You tow it, you fill it, you dump it.${
            halfDay ? ` Half day at ${formatMoney(halfDay)} if you only need five hours.` : ""
          }`}
          steps={selfServiceSteps}
          footnote={`Needs ${t.towingRequirements.slice(0, 3).join(" · ")}`}
        />
        <ServicePanel
          title="Full service"
          rate={fullDay + t.deliveryFee}
          blurb={`No truck, no hitch, no dump run. We drop it, pick it up and take it to the landfill. ${formatMoney(t.deliveryFee)} delivery.`}
          steps={fullServiceSteps}
          footnote={[
            t.weekendSurcharge && `Weekend surcharge ${formatMoney(t.weekendSurcharge)}`,
            halfDay && `Half day ${formatMoney(halfDay + t.deliveryFee)}`,
          ]
            .filter(Boolean)
            .join(" · ")}
          shaded
        />
      </div>
    </SectionWrapper>
  );
};
