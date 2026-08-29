import * as React from "react";
import { ButtonLink, buttonClasses } from "~src/components";
import { business } from "~src/data/business";
import { trailers, primaryBookingPath } from "~src/data/trailers";
import { formatMoney } from "~src/utils";
// @ts-ignore
import heroImage from "url:../../assets/7x14Dump_Trailer_Front.jpg";

export const HeroImageSection = () => {
  const trailer = trailers[0];
  const stats = [
    { value: trailer.capacity.replace(" lbs", " lb"), label: "Payload capacity" },
    { value: formatMoney(trailer.deliveryFee), label: "Delivery fee" },
    { value: "$0", label: "Security deposit" },
    { value: "24 hr", label: "Free cancellation" },
  ];

  return (
    <div className="relative bg-ink overflow-hidden">
      <img
        src={heroImage}
        alt="Southland 7x14 dump trailer"
        className="absolute inset-0 w-full h-full object-cover object-[60%_55%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />

      <div className="relative mx-auto max-w-site px-5 sm:px-10 pt-20 pb-24 sm:pt-28 sm:pb-36 lg:min-h-[620px] flex items-center">
        <div className="max-w-[620px] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-[34px] h-0.5 bg-amber" />
            <span className="eyebrow text-amber">Rates posted. Nothing hidden.</span>
          </div>
          <h1 className="display text-6xl sm:text-8xl lg:text-[96px] leading-[0.9] tracking-[-0.015em] text-bone">
            {formatMoney(trailer.rentalPrices.fullDay)} a day.
            <br />
            No deposit.
          </h1>
          <p className="max-w-[520px] text-lg sm:text-[19px] leading-relaxed text-rule-2">
            A 14,000 lb Southland dump trailer, cleaned and hitched, for hauling
            junk, dirt, gravel and construction debris. Pick it up yourself at{" "}
            {formatMoney(trailer.rentalPrices.fullDay)}, or we deliver, dump and
            clean it for{" "}
            {formatMoney(trailer.rentalPrices.fullDay + trailer.deliveryFee)}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 pt-1.5">
            <ButtonLink to={primaryBookingPath} variant="amber" size="large">
              Request dates
            </ButtonLink>
            <a
              href={business.phoneHref}
              className={buttonClasses("outline-light", "large")}
            >
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="relative bg-ink/90 border-t border-ink-rule">
        <div className="mx-auto max-w-site px-5 sm:px-10 grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 flex flex-col gap-1.5 ${
                i > 0 ? "lg:border-l lg:border-ink-rule lg:pl-8" : ""
              } ${i % 2 === 1 ? "border-l border-ink-rule pl-6 lg:pl-8" : ""}`}
            >
              <span className="font-display font-bold text-[26px] leading-none text-bone">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-mute-4">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
