import * as React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Badge, ButtonLink, Card } from "~src/components";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const listForOperator = makeFunctionReference<
  "query",
  { from: number; to: number }
>("bookings:listForOperator");

function dayKey(value: number) {
  return new Date(value).toDateString();
}

function dateRange(start: number, end: number) {
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${format.format(new Date(start))} -> ${format.format(new Date(end))}`;
}

function BookingRow({ booking }: { booking: any }) {
  const action =
    booking.status === "confirmed"
      ? { label: "Handoff", href: `/operator/rentals/${booking._id}/handoff` }
      : booking.status === "checked_out"
        ? { label: "Return", href: `/operator/rentals/${booking._id}/return` }
        : null;

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">
              {booking.renter?.name || "Unnamed renter"}
            </p>
            {booking.renter?.phone && (
              <a href={`tel:${booking.renter.phone}`} className="text-amber-dark underline">
                {booking.renter.phone}
              </a>
            )}
          </div>
          <Badge variant="muted">{booking.status}</Badge>
        </div>
        <div className="text-[14px] leading-relaxed text-body-2">
          <p>{dateRange(booking.start, booking.end)}</p>
          {booking.vehicle && (
            <p>
              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
            </p>
          )}
        </div>
        {booking.vehicle?.verifyAtHandoff?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {booking.vehicle.verifyAtHandoff.map((item: string) => (
              <Badge key={item} variant="amber">{item}</Badge>
            ))}
          </div>
        )}
        {action && (
          <ButtonLink to={action.href} variant="amber" className="self-start">
            {action.label}
          </ButtonLink>
        )}
      </div>
    </Card>
  );
}

export function OperatorRentalsView() {
  const today = useMemo(() => new Date(), []);
  const from = today.getTime() - MS_PER_DAY;
  const to = today.getTime() + 7 * MS_PER_DAY;
  const bookings = (useQuery(listForOperator, { from, to }) ?? []) as any[];
  const groups = [
    ["Out now", bookings.filter((booking) => booking.status === "checked_out")],
    [
      "Today",
      bookings.filter(
        (booking) =>
          booking.status !== "checked_out" &&
          dayKey(booking.start) === dayKey(today.getTime())
      ),
    ],
    [
      "Upcoming",
      bookings.filter(
        (booking) =>
          booking.status !== "checked_out" &&
          dayKey(booking.start) !== dayKey(today.getTime())
      ),
    ],
  ] as const;

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-amber-dark">Operator</span>
          <h1 className="display text-5xl text-ink">Rentals</h1>
        </div>
        <Link to="/" className="nav-link text-ink border-b-2 border-amber">Home</Link>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map(([title, rows]) => (
          <section key={title}>
            <h2 className="mb-3 font-semibold uppercase tracking-[0.16em] text-[13px] text-ink">
              {title}
            </h2>
            <div className="grid gap-3">
              {rows.length > 0 ? (
                rows.map((booking) => <BookingRow key={booking._id} booking={booking} />)
              ) : (
                <p className="text-body-2">No rentals.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
