import * as React from "react";
import { SectionWrapper } from "~src/components";
import { business } from "~src/data/business";
// @ts-ignore
import portfolioImage from "url:../../assets/portfolio.jpeg";

const companyStats = [
  { value: "15+ tonnes", label: "of junk removed" },
  { value: "10+", label: "customers served" },
  { value: "3 acres", label: "sod & material delivered" },
];

const ownerBio =
  "Landon started helping friends and family with his dump trailer and decided to share it everyone to get rid of their junk! He brings the pacific islander work ethic and passion for customer service to the trailer rental business.";

export const AboutOurTeamSection = () => (
  <SectionWrapper className="bg-bone-2">
    <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-14 items-start">
      <img
        src={portfolioImage}
        alt={`${business.ownerName}, owner and operator`}
        className="w-full max-w-[400px] aspect-[4/5] object-cover"
      />
      <div className="flex flex-col gap-5">
        <span className="eyebrow text-amber-dark">About</span>
        <h2 className="display text-4xl sm:text-[54px] text-ink">
          Owner-operator, not a rental counter
        </h2>
        <p className="max-w-[640px] text-lg leading-relaxed text-body">
          {ownerBio}
        </p>
        <p className="max-w-[640px] text-base leading-relaxed text-body-2">
          The mission is simple: reliable dump trailer rentals at affordable
          prices, top-quality equipment, friendly service. Home cleanup,
          landscaping or a construction project — the trailer is maintained and
          ready.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-rule-2 mt-3 pt-6">
          {companyStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <span className="font-display font-bold text-[42px] leading-none text-ink">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.14em] leading-snug text-mute">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);
