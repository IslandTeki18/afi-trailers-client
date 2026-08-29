import * as React from "react";
import {
  TruckIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { FeatureCard, FeatureCardProps } from "../FeatureCard";
import { SectionWrapper, SectionHeading } from "~src/components";

const iconClass = "w-7 h-7";

const features: FeatureCardProps[] = [
  {
    icon: <TruckIcon className={iconClass} />,
    title: "Quality equipment",
    description:
      "Built for heavy-duty work and maintained between every rental so it performs on your job.",
  },
  {
    icon: <CurrencyDollarIcon className={iconClass} />,
    title: "Posted rates",
    description:
      "Half day, full day, delivery and weekend surcharge are all on the site. No deposit, no surprises.",
  },
  {
    icon: <StarIcon className={iconClass} />,
    title: "Simple booking",
    description:
      "Request your dates online or call. Confirmation comes by text, usually within the hour.",
  },
  {
    icon: <ClockIcon className={iconClass} />,
    title: "Owner-operated",
    description:
      "You deal with the person who owns the trailer, from first call to drop-off.",
  },
];

export const WhyRentWithUsSection: React.FC = () => (
  <SectionWrapper className="bg-bone">
    <SectionHeading eyebrow="Why rent with us" title="Straight answers, clean trailer" />
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  </SectionWrapper>
);
