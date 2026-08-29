import * as React from "react";
import { Header, SectionWrapper, buttonClasses } from "~src/components";
import { AdditionalFeesSection } from "~src/features/Marketing/components";
import { business } from "~src/data/business";
import { trailers } from "~src/data/trailers";
import { formatLbs } from "~src/utils";

const allowedItems = [
  "Construction debris (non-hazardous)",
  "Yard waste and landscaping materials",
  "Household junk and furniture",
  "Concrete and asphalt (small quantities)",
  "Soil and gravel",
  "Scrap metal (non-hazardous)",
];

const prohibitedItems = [
  "Hazardous materials (chemicals, paints, solvents)",
  "Electronics and appliances",
  "Tires · Batteries · Asbestos",
  "Oils and fuels",
  "Biological waste",
  "Radioactive materials",
];

type Rule = { id: string; number: string; title: string; items: string[] };

const maxLoad = formatLbs(trailers[0].weight.maxLoad);

const rules: Rule[] = [
  {
    id: "loading",
    number: "03",
    title: "Loading & weight",
    items: [
      `Never exceed ${maxLoad} of load. Dirt and concrete hit the limit long before the trailer looks full.`,
      "Distribute weight evenly across the bed, slightly forward of the axles.",
      "Nothing sticking out past the walls or over the tailgate.",
    ],
  },
  {
    id: "tarping",
    number: "04",
    title: "Tarping & transit",
    items: [
      "The tarp must cover the load entirely any time the trailer is moving.",
      "Check the safety chains, lights and rear doors before you pull out.",
      "Leave extra following distance. Loaded, this rig stops slowly.",
    ],
  },
  {
    id: "towing",
    number: "05",
    title: "Towing requirements",
    items: [
      `3/4 ton pickup or larger, rated to at least ${maxLoad}.`,
      '2 5/16" ball hitch and a working 7-pin connector.',
      "Valid driver's license. Not sure your truck qualifies? Call first.",
    ],
  },
];

const cleaningRule: Rule = {
  id: "cleaning",
  number: "06",
  title: "Cleaning & return",
  items: [
    "Return the trailer empty. Sweep out loose dirt and debris.",
    "Tarp rolled and stowed, doors latched, jack down.",
    "Back on time. Self service returns run on the clock from pickup.",
    "Damage happens. Tell us the same day and we'll sort it out.",
  ],
};

const toc = [
  { href: "#allowed", label: "01 · Allowed items" },
  { href: "#prohibited", label: "02 · Prohibited items" },
  ...rules.map((r) => ({ href: `#${r.id}`, label: `${r.number} · ${r.title}` })),
  { href: `#${cleaningRule.id}`, label: `${cleaningRule.number} · ${cleaningRule.title}` },
];

const RuleBlock = ({ rule }: { rule: Rule }) => (
  <div id={rule.id} className="flex flex-col gap-3 border-t-2 border-ink pt-5">
    <span className="font-display font-bold text-xl leading-none text-mute-2">{rule.number}</span>
    <h2 className="display text-[30px] text-ink">{rule.title}</h2>
    <ul className="flex flex-col gap-3">
      {rule.items.map((item) => (
        <li key={item} className="flex gap-2.5 text-base leading-relaxed text-body">
          <span className="text-amber-mid">—</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ItemList = ({
  id,
  number,
  title,
  items,
  accent,
}: {
  id: string;
  number: string;
  title: string;
  items: string[];
  accent: "ink" | "rust";
}) => (
  <div id={id} className={`bg-paper border border-rule border-t-4 ${accent === "rust" ? "border-t-rust" : "border-t-ink"}`}>
    <div className="px-6 py-5 border-b border-bone-3 flex items-baseline gap-3.5">
      <span className="font-display font-bold text-xl leading-none text-mute-2">{number}</span>
      <h2 className="display text-[32px] text-ink">{title}</h2>
    </div>
    <ul>
      {items.map((item, i) => (
        <li
          key={item}
          className={`px-6 py-3.5 text-base text-body ${i < items.length - 1 ? "border-b border-rule-hair" : ""}`}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const TrailerUsageView = () => (
  <>
    <Header
      subTitle="Know before you load"
      title="Trailer etiquette"
      description="Six rules keep the trailer on the road and the fees off your bill. Read them before you load — if anything on your list is a maybe, call and ask."
      aside={
        <nav className="border border-ink-rule p-6 flex flex-col gap-3.5">
          <span className="font-semibold text-[11px] uppercase tracking-[0.2em] text-amber">On this page</span>
          {toc.map((item) => (
            <a key={item.href} href={item.href} className="text-[15px] text-rule-2 hover:text-amber">
              {item.label}
            </a>
          ))}
        </nav>
      }
    />

    <SectionWrapper paddingY="none" className="pt-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <ItemList id="allowed" number="01" title="Load these" items={allowedItems} accent="ink" />
        <ItemList id="prohibited" number="02" title="Never these" items={prohibitedItems} accent="rust" />
      </div>
    </SectionWrapper>

    <SectionWrapper paddingY="none" className="pt-11">
      <div className="grid gap-8 md:grid-cols-3">
        {rules.map((rule) => (
          <RuleBlock key={rule.id} rule={rule} />
        ))}
      </div>
    </SectionWrapper>

    <SectionWrapper paddingY="none" className="pt-16">
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <RuleBlock rule={cleaningRule} />
        <AdditionalFeesSection />
      </div>
    </SectionWrapper>

    <SectionWrapper paddingY="none" className="pt-16 pb-[88px]">
      <div className="bg-amber p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="flex flex-col gap-2">
          <span className="display text-[30px] text-ink">Not sure about something in your pile?</span>
          <span className="text-[17px] leading-relaxed text-amber-deep">
            Ask before you load it. Non-compliance can mean extra fees, denial of service, or legal action.
          </span>
        </div>
        <a href={business.phoneHref} className={buttonClasses("primary", "large", "flex-none")}>
          Call {business.phoneDisplay}
        </a>
      </div>
    </SectionWrapper>
  </>
);
