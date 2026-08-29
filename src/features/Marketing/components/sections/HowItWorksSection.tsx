import * as React from "react";
import { SectionWrapper } from "~src/components";

const steps = [
  {
    title: "Pick your trailer",
    body: "Sizes, specs and rates are on every listing. One 7x14 dump trailer today, more on the way.",
  },
  {
    title: "Request your dates",
    body: "Send dates and service type. Landon confirms by text or call, usually within the hour.",
  },
  {
    title: "Haul it off",
    body: "Hitch up in Spanish Fork or meet us at your site. Pay in full at pickup or drop-off.",
  },
];

export const HowItWorksSection = () => (
  <SectionWrapper className="bg-bone">
    <div className="grid md:grid-cols-3 border-t-2 border-ink">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className={`pt-9 pb-4 ${
            i === 0 ? "md:pr-8" : "md:pl-8 md:border-l md:border-rule"
          } ${i === 1 ? "md:pr-8" : ""}`}
        >
          <div className="font-display font-bold text-[64px] leading-none text-amber">
            0{i + 1}
          </div>
          <h3 className="display text-[26px] leading-[1.05] text-ink mt-2.5 mb-2">
            {step.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-body-2">{step.body}</p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
