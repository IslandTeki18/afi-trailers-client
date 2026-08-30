import * as React from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, ButtonLink, Card, Input, Textarea } from "~src/components";
import { RentalType, ServiceType, Trailer } from "~src/types";
import { bookingPath, findTrailer, trailerPath } from "~src/data/trailers";
import { business } from "~src/data/business";
import { sendEmail } from "~src/utils/emailjs";
import { classNames, formatMoney } from "~src/utils";
import { TrailerNotFound } from "~src/features/Trailers/components";
import { quoteRental } from "../utils/pricing";

type Status = "idle" | "sending" | "sent" | "error";

const emptyDetails = {
  name: "",
  phone: "",
  email: "",
  address: "",
  hauling: "",
};

const toInputDate = (d: Date) => d.toISOString().slice(0, 10);
const parseInputDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const StepCard = ({
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
          <span className="w-6 h-6 bg-ink text-bone font-bold text-[13px] leading-6 text-center">{n}</span>
          <span className="font-semibold text-[13px] uppercase tracking-[0.18em] text-ink">{title}</span>
        </div>
        {right}
      </div>
    }
  >
    {children}
  </Card>
);

const serviceOptions = (t: Trailer): { value: ServiceType; title: string; blurb: string; note: string; price: number; includes: string[] }[] => [
  {
    value: "self",
    title: "Self service",
    price: t.rentalPrices.fullDay,
    blurb: "You tow it, fill it, dump it, bring it back. We clean it.",
    note: 'Needs 3/4 ton + 2 5/16" ball',
    includes: ["You pick up", "You dump", "We clean"],
  },
  {
    value: "full",
    title: "Full service",
    price: t.rentalPrices.fullDay + t.deliveryFee,
    blurb: `We deliver, pick up, dump and clean. ${formatMoney(t.deliveryFee)} delivery fee.`,
    note: "No truck needed",
    includes: ["Delivery", "Pickup", "Dumping"],
  },
];

export const TrailerBookingView = () => {
  const { trailerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trailer = findTrailer(trailerId);

  const today = useMemo(() => new Date(), []);
  const [service, setService] = useState<ServiceType | null>(
    searchParams.get("service") === "full" ? "full" : null
  );
  const [rentalType, setRentalType] = useState<RentalType>("full");
  const [startDate, setStartDate] = useState(toInputDate(today));
  const [endDate, setEndDate] = useState(toInputDate(today));
  const [details, setDetails] = useState(emptyDetails);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  if (!trailer) return <TrailerNotFound />;

  const start = parseInputDate(startDate);
  const end = rentalType === "half" ? start : parseInputDate(endDate);
  const quote = quoteRental(trailer, start, end, rentalType, "full");
  const hasHalfDay = Boolean(trailer.rentalPrices.halfDay);

  const set = (field: keyof typeof emptyDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDetails({ ...details, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (service !== "full") return;
    setStatus("sending");
    const lines = [
      "BOOKING REQUEST",
      `Trailer: ${trailer.name}`,
      "Service: Full service",
      `Rental: ${rentalType === "half" ? "Half day (5 hr)" : `Full day x ${quote.days}`}`,
      `Dates: ${formatDate(start)} -> ${formatDate(end)}`,
      service === "full" ? `Delivery address: ${details.address}` : "",
      `Hauling: ${details.hauling}`,
      `Quote: ${formatMoney(quote.total)} (base ${formatMoney(quote.base)}, weekend ${formatMoney(quote.weekendSurcharge)}, delivery ${formatMoney(quote.deliveryFee)})`,
    ].filter(Boolean);
    try {
      await sendEmail({
        name: details.name,
        email: details.email,
        phone: details.phone,
        message: lines.join("\n"),
      });
      setStatus("sent");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-24 flex flex-col gap-5">
        <span className="eyebrow text-amber-dark">Request sent</span>
        <h1 className="display text-5xl sm:text-7xl text-ink">We've got your dates</h1>
        <p className="max-w-xl text-lg leading-relaxed text-body-2">
          {formatDate(start)} → {formatDate(end)}, full service.
          Landon will confirm by text at {details.phone}, usually within the hour.
          Nothing is charged until pickup or drop-off.
        </p>
        <ButtonLink to="/" className="self-start">Back to home</ButtonLink>
      </div>
    );
  }

  const summaryRows: [string, string][] = [
    ["Trailer", trailer.shortName],
    ["Service", "Full service"],
    [
      `${formatDate(start)} → ${formatDate(end)}`,
      rentalType === "half" ? "Half day" : `${quote.days} full day${quote.days > 1 ? "s" : ""}`,
    ],
    [rentalType === "half" ? "Half day rate" : "Full day rate", formatMoney(quote.dayRate)],
    ...(quote.weekendDays > 0
      ? [["Weekend surcharge", formatMoney(quote.weekendSurcharge)] as [string, string]]
      : []),
    ["Delivery", quote.deliveryFee ? formatMoney(quote.deliveryFee) : "—"],
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-site w-full px-5 sm:px-10 pt-11 pb-24">
      <div className="flex flex-col gap-3 mb-9">
        <span className="eyebrow text-amber-dark">No payment today</span>
        <h1 className="display text-5xl sm:text-[66px] leading-[0.94] text-ink">
          {service === "full" ? "Request your dates" : "Choose your rental service"}
        </h1>
        <p className="max-w-[620px] text-lg leading-relaxed text-body-3">
          Send the dates and what you're hauling. Landon confirms by text or call
          — usually within the hour — and you pay in full at pickup or drop-off.
        </p>
      </div>

      <div className="grid gap-11 lg:grid-cols-[1fr_400px] items-start">
        <div className="flex flex-col gap-8">
          <StepCard n={1} title="Trailer">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              {trailer.photos?.[0] && (
                <img src={trailer.photos[0]} alt="" className="w-full sm:w-[180px] h-[118px] object-cover" />
              )}
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="display text-[30px] text-ink">{trailer.name}</span>
                <span className="text-[15px] text-body-2">
                  {trailer.dimensions.length} ft x {trailer.dimensions.width} ft, {trailer.dimensions.height} ft walls ·{" "}
                  {trailer.weight.maxLoad.toLocaleString()} lb max load
                </span>
              </div>
              <Link to={trailerPath(trailer._id)} className="nav-link text-ink border-b-2 border-amber pb-1 self-start">
                Specs
              </Link>
            </div>
          </StepCard>

          <StepCard n={2} title="Service">
            <div className="grid gap-4 sm:grid-cols-2">
              {serviceOptions(trailer).map((opt) => {
                const active = opt.value === service;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      opt.value === "self"
                        ? navigate(`${bookingPath(trailer._id)}/self`)
                        : setService("full")
                    }
                    className={classNames(
                      "p-5 flex flex-col gap-2.5 text-left focus:outline-none",
                      active ? "border-2 border-ink bg-cream" : "border border-rule-2"
                    )}
                  >
                    <span className="flex justify-between items-baseline gap-3">
                      <span className={classNames("display text-[26px]", active ? "text-ink" : "text-mute")}>{opt.title}</span>
                      <span className={classNames("font-display font-bold text-[28px] leading-none", active ? "text-ink" : "text-mute")}>
                        {formatMoney(opt.price)}
                      </span>
                    </span>
                    <span className={classNames("text-[15px] leading-snug", active ? "text-body-2" : "text-mute-2")}>{opt.blurb}</span>
                    <span className={classNames("text-[11px] font-medium uppercase tracking-[0.16em]", active ? "text-amber-dark" : "text-mute-5")}>
                      {opt.note}
                    </span>
                    <ul className="mt-1 flex flex-col gap-1 text-[13px] text-body-3">
                      {opt.includes.map((item) => (
                        <li key={item}>+ {item}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </StepCard>

          {service === "full" && (
            <>
              <StepCard
                n={3}
                title="Dates"
                right={
                  hasHalfDay && (
                    <div className="flex gap-1">
                      {(["full", "half"] as RentalType[]).map((rt) => (
                        <button
                          key={rt}
                          type="button"
                          onClick={() => setRentalType(rt)}
                          className={classNames(
                            "px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
                            rt === rentalType ? "bg-ink text-bone" : "text-mute hover:text-ink"
                          )}
                        >
                          {rt === "full" ? "Full day" : "Half day"}
                        </button>
                      ))}
                    </div>
                  )
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={rentalType === "half" ? "Date" : "Start"}
                    id="start"
                    type="date"
                    required
                    min={toInputDate(today)}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (e.target.value > endDate) setEndDate(e.target.value);
                    }}
                  />
                  {rentalType === "full" ? (
                    <Input
                      label="Return"
                      id="end"
                      type="date"
                      required
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="label-caps">Length</span>
                      <div className="border border-rule-2 bg-bone-4 px-3.5 py-3 text-base text-mute">5 hours from pickup</div>
                    </div>
                  )}
                </div>
                {trailer.weekendSurcharge && (
                  <p className="mt-4 text-[13px] text-mute">
                    Weekend surcharge of {formatMoney(trailer.weekendSurcharge)} per day applies to Saturdays and Sundays.
                  </p>
                )}
              </StepCard>

              <StepCard n={4} title="Your details">
                <div className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Full name" id="name" autoComplete="name" required placeholder="John Doe" value={details.name} onChange={set("name")} />
                    <Input label="Mobile" hint="we text you" id="phone" type="tel" autoComplete="tel" required placeholder="(555) 234-5678" value={details.phone} onChange={set("phone")} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Email" id="email" type="email" autoComplete="email" required placeholder="john.doe@example.com" value={details.email} onChange={set("email")} />
                    <Input
                      label="Delivery address"
                      hint="full service only"
                      id="address"
                      autoComplete="street-address"
                      required
                      placeholder="123 Main St, Spanish Fork"
                      value={details.address}
                      onChange={set("address")}
                    />
                  </div>
                  <Textarea
                    label="What are you hauling?"
                    id="hauling"
                    rows={3}
                    required
                    placeholder="Roughly what's going in the trailer — helps us flag anything prohibited before you load."
                    value={details.hauling}
                    onChange={set("hauling")}
                  />
                  <label className="flex gap-3 items-start border-t border-bone-3 pt-4 text-[15px] leading-snug text-body cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-[18px] w-[18px] rounded-none border-2 border-ink text-ink focus:ring-amber"
                    />
                    <span>
                      I've read the{" "}
                      <Link to="/trailers/usage-guidelines" className="text-amber-dark underline">trailer etiquette</Link>{" "}
                      and confirm my load contains no prohibited items.
                    </span>
                  </label>
                </div>
              </StepCard>
            </>
          )}
        </div>

        {service === "full" && (
          <Card variant="ink" header="Request summary" className="lg:sticky lg:top-6">
            <dl>
              {summaryRows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-3 border-b border-bone-3">
                  <dt className="text-[15px] text-body-2">{label}</dt>
                  <dd className="font-semibold text-[15px] text-ink text-right">{value}</dd>
                </div>
              ))}
              <div className="flex justify-between items-baseline pt-4 pb-5 border-b-2 border-ink">
                <dt className="font-semibold text-[13px] uppercase tracking-[0.16em] text-ink">
                  Due at drop-off
                </dt>
                <dd className="font-display font-bold text-[40px] leading-none text-ink">{formatMoney(quote.total)}</dd>
              </div>
            </dl>
            <Button type="submit" variant="amber" className="w-full mt-5" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send request"}
            </Button>
            {status === "error" && (
              <p className="mt-3 text-sm text-rust" role="alert">
                Something went wrong. Call or text {business.phoneDisplay} instead.
              </p>
            )}
            <p className="mt-3.5 text-[13px] leading-relaxed text-mute">
              Nothing is charged now. We confirm by text. Free cancellation up to
              24 hours before pickup.
            </p>
          </Card>
        )}
      </div>
    </form>
  );
};
