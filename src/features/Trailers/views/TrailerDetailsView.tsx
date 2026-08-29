import * as React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, ButtonLink, buttonClasses, Card } from "~src/components";
import { ServiceType } from "~src/types";
import { findTrailer, bookingPath } from "~src/data/trailers";
import { business } from "~src/data/business";
import { formatMoney, formatLbs, classNames } from "~src/utils";
import { TrailerNotFound } from "../components";

const serviceOptions: { value: ServiceType; label: string; sub: string }[] = [
  { value: "self", label: "Self", sub: "You tow" },
  { value: "full", label: "Full", sub: "We deliver" },
];

export const TrailerDetailsView: React.FC = () => {
  const { trailerId } = useParams();
  const trailer = findTrailer(trailerId);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [service, setService] = useState<ServiceType>("self");

  if (!trailer) return <TrailerNotFound />;

  const { length, width, height } = trailer.dimensions;
  const delivery = service === "full" ? trailer.deliveryFee : 0;
  const photos = trailer.photos ?? [];

  const specs = [
    ["Capacity", trailer.capacity],
    ["Dimensions", `${length}L x ${width}W x ${height}H`],
    ["Weight, empty", formatLbs(trailer.weight.empty)],
    ["Max load", formatLbs(trailer.weight.maxLoad)],
    ["Insurance required", trailer.insuranceRequired ? "Yes" : "No"],
    ["Yard", trailer.location.address],
  ];

  const rates: [string, number][] = [
    ...(trailer.rentalPrices.halfDay
      ? [["Half day · 5 hr", trailer.rentalPrices.halfDay + delivery] as [string, number]]
      : []),
    ["Full day · 24 hr", trailer.rentalPrices.fullDay + delivery],
    ...(trailer.weekendSurcharge
      ? [["Weekend surcharge", trailer.weekendSurcharge] as [string, number]]
      : []),
    ["Security deposit", 0],
  ];

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 pt-6 pb-20">
      <nav className="text-xs font-medium uppercase tracking-[0.14em] text-mute-2">
        <Link to="/trailers" className="hover:text-ink">Trailers</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{trailer.name}</span>
      </nav>

      <div className="mt-6 grid gap-11 lg:grid-cols-[1fr_400px] items-start">
        <div className="flex flex-col gap-3.5">
          {photos[photoIndex] && (
            <img
              src={photos[photoIndex]}
              alt={trailer.name}
              className="w-full h-[280px] sm:h-[430px] object-cover"
            />
          )}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3.5">
              {photos.map((photo, i) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className={classNames(
                    "h-24 w-full overflow-hidden focus:outline-none",
                    i === photoIndex && "outline outline-2 outline-ink"
                  )}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <span className="eyebrow text-amber-dark">{trailer.type}</span>
            <h1 className="display text-5xl sm:text-[62px] leading-[0.94] text-ink">
              {trailer.name}
            </h1>
            <p className="max-w-[640px] text-lg leading-relaxed text-body">
              {trailer.description}
            </p>
          </div>

          <div className="mt-6 border-t-2 border-ink">
            <h2 className="display text-[30px] text-ink mt-5 mb-3.5">Specifications</h2>
            <dl className="grid sm:grid-cols-2 gap-x-10">
              {specs.map(([label, value]) => (
                <div key={label} className="kv-row">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-mute">{label}</dt>
                  <dd className="font-semibold text-base text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 border-t-2 border-ink">
            <h2 className="display text-[30px] text-ink mt-5 mb-3.5">Features</h2>
            <ul className="grid sm:grid-cols-2 gap-x-10">
              {trailer.features.map((feature) => (
                <li key={feature} className="py-3 border-b border-rule text-base text-body">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 bg-ink p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-2.5">
              <span className="eyebrow text-amber">Before you tow</span>
              <h3 className="display text-[30px] text-bone">Towing requirements</h3>
              <ul className="mt-2 flex flex-col gap-2.5">
                {trailer.towingRequirements.map((req) => (
                  <li key={req} className="flex gap-3 text-base text-rule-2">
                    <span className="text-amber">—</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:border-ink-rule md:pl-8 flex flex-col gap-3">
              <span className="eyebrow text-amber">Load rules</span>
              <p className="text-[15px] leading-relaxed text-mute-3">
                No hazardous materials, tires, batteries, appliances or fuels.
                Tarp covers the load in transit.
              </p>
              <Link
                to="/trailers/usage-guidelines"
                className="nav-link text-amber border-b-2 border-amber pb-1 self-start"
              >
                Read trailer etiquette →
              </Link>
            </div>
          </div>
        </div>

        {/* booking rail */}
        <Card
          variant="ink"
          className="lg:sticky lg:top-6"
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs uppercase tracking-[0.2em]">Availability</span>
              <Badge variant="amber">
                {trailer.availability.isAvailable ? "Available now" : "On request"}
              </Badge>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <span className="label-caps">Service type</span>
              <div className="grid grid-cols-2 gap-2.5">
                {serviceOptions.map((opt) => {
                  const active = opt.value === service;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setService(opt.value)}
                      className={classNames(
                        "p-3 flex flex-col gap-1 text-left focus:outline-none",
                        active ? "border-2 border-ink" : "border border-rule-2"
                      )}
                    >
                      <span className={classNames("font-bold text-[15px] uppercase tracking-[0.06em]", active ? "text-ink" : "text-mute")}>
                        {opt.label}
                      </span>
                      <span className={classNames("text-[13px]", active ? "text-mute" : "text-mute-2")}>
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <dl className="border-t border-bone-3">
              {rates.map(([label, amount], i) => (
                <div
                  key={label}
                  className={classNames(
                    "flex items-baseline justify-between py-3.5",
                    i < rates.length - 1 && "border-b border-bone-3"
                  )}
                >
                  <dt className="text-base text-body">{label}</dt>
                  <dd className="font-display font-bold text-2xl leading-none text-ink">
                    {formatMoney(amount)}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink to={`${bookingPath(trailer._id)}?service=${service}`} variant="amber">
              Request these dates
            </ButtonLink>
            <a href={business.phoneHref} className={buttonClasses("outline")}>
              Call {business.phoneDisplay}
            </a>
            <p className="text-[13px] leading-relaxed text-mute text-center">
              Requests are confirmed by text, usually within the hour. Free
              cancellation up to 24 hours out.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
