import * as React from "react";
import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { classNames } from "~src/utils";
import { PricingFrequency, PricingTier } from "../../types";
import { SectionWrapper } from "~src/components";

type TrailerPricingSectionProps = {};

const frequencies: PricingFrequency[] = [
  { value: "fullService", label: "Full Service", priceSuffix: "/day" },
  { value: "selfService", label: "Self Service", priceSuffix: "/day" },
];
const tiers: PricingTier[] = [
  {
    name: "Half Day Rental",
    id: "tier-half-day",
    href: "/trailers",
    price: { fullService: "$80", selfService: "$60" },
    description: "Great for small projects and one-time use.",
    features: {
      fullService: [
        "5 Hour Rental Limit",
        "We Deliver the Trailer",
        "You Fill the Trailer",
        "We Pick Up the Trailer",
        "We Dump the Trailer",
        "We Clean the Trailer",
      ],
      selfService: [
        "5 Hour Rental Limit",
        "You Pick Up the Trailer",
        "You Fill the Trailer",
        "You Dump the Trailer",
        "You Return the Trailer",
        "We Clean the Trailer",
      ],
    },
    featured: false,
    cta: "Book a Trailer",
  },
  {
    name: "Full Day Rental",
    id: "tier-full-day",
    href: "/trailers",
    price: { fullService: "$100", selfService: "$80" },
    description: "Great for all day projects and multiple uses.",
    features: {
      fullService: [
        "24 Hour Rental Limit",
        "We Deliver the Trailer",
        "You Fill the Trailer",
        "We Pick Up the Trailer",
        "We Dump the Trailer",
        "We Clean the Trailer",
      ],
      selfService: [
        "24 Hour Rental Limit",
        "You Pick Up the Trailer",
        "You Fill the Trailer",
        "You Dump the Trailer",
        "You Return the Trailer",
        "We Clean the Trailer",
      ],
    },
    featured: false,
    cta: "Book a Trailer",
  },
];

export const TrailerPricingSection = (props: TrailerPricingSectionProps) => {
  const [frequency, setFrequency] = useState(frequencies[0]);
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-4xl text-center">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
            Our Pricing
          </p>
        </div>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Straightforward Pricing – No Hidden Fees
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Our dump trailer rental rates are simple and transparent. Choose a
        rental period that works for you and your project, whether it’s for a
        day, a week, or a month.
      </p>
      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? "bg-gray-900 ring-gray-900" : "ring-gray-200",
              "rounded-3xl p-8 ring-1 xl:p-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? "text-white" : "text-gray-900",
                "text-lg font-semibold leading-8"
              )}
            >
              {tier.name}
            </h3>
            <p
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-4 text-sm leading-6"
              )}
            >
              {tier.description}
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span
                className={classNames(
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-4xl font-bold tracking-tight"
                )}
              >
                {typeof tier.price === "string"
                  ? tier.price
                  : tier.price[frequency.value]}
              </span>
              {typeof tier.price !== "string" ? (
                <span
                  className={classNames(
                    tier.featured ? "text-gray-300" : "text-gray-600",
                    "text-sm font-semibold leading-6"
                  )}
                >
                  {frequency.priceSuffix}
                </span>
              ) : null}
            </p>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                  : "bg-yellow-600 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline-yellow-600",
                "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              )}
            >
              {tier.cta}
            </a>
            <ul
              role="list"
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
              )}
            >
              {tier.features[frequency.value].map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? "text-white" : "text-yellow-600",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
