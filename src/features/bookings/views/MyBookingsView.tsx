import * as React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "~src/components";
import { cancellationRefundCents } from "~convex/rentalTerms";
import { formatMoney } from "~src/utils";

const listMine = makeFunctionReference<"query", Record<string, never>>(
  "bookings:listMine"
);
const cancelBooking = makeFunctionReference<"mutation", { bookingId: string }>(
  "bookings:cancel"
);
const listPhotos = makeFunctionReference<
  "query",
  { bookingId: string; phase: "pickup" | "return" }
>("photos:listForBooking");

function dateRange(start: number, end: number) {
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${format.format(new Date(start))} -> ${format.format(new Date(end))}`;
}

function PhotoEvidence({ bookingId }: { bookingId: string }) {
  const pickup = (useQuery(listPhotos, { bookingId, phase: "pickup" }) ?? []) as any[];
  const returned = (useQuery(listPhotos, { bookingId, phase: "return" }) ?? []) as any[];
  const photos = [...pickup, ...returned];

  if (photos.length === 0) return null;
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {photos.map((photo) => (
        <a key={photo._id} href={photo.url} target="_blank" rel="noreferrer">
          <img src={photo.url} alt="" className="h-24 w-full object-cover" />
          <span className="mt-1 block text-[12px] text-mute">
            {photo.phase}: {photo.label}
          </span>
        </a>
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const cancel = useMutation(cancelBooking);
  const [message, setMessage] = useState("");
  const refund = cancellationRefundCents({
    start: booking.start,
    days: booking.quote.days,
    total: booking.quote.total,
    dayRate: booking.quote.dayRate,
  });

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-ink">{dateRange(booking.start, booking.end)}</p>
            <Link
              to={`/bookings/${booking._id}/confirmation`}
              className="text-amber-dark underline"
            >
              View confirmation
            </Link>
          </div>
          <Badge variant="muted">{booking.status}</Badge>
        </div>

        {booking.status === "confirmed" && (
          <div className="border-t border-rule pt-4">
            <p className="mb-3 text-[14px] text-body-2">
              Cancellation preview: refund {formatMoney(refund / 100)} of{" "}
              {formatMoney(booking.quote.total / 100)}.
            </p>
            <Button
              variant="outline"
              onClick={async () => {
                const result = (await cancel({ bookingId: booking._id })) as {
                  refundAmount: number;
                };
                setMessage(`Cancelled. Refund: ${formatMoney(result.refundAmount / 100)}.`);
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {(booking.status === "returned" || booking.status === "closed") && (
          <PhotoEvidence bookingId={booking._id} />
        )}
        {message && <p className="text-sm text-body-2">{message}</p>}
      </div>
    </Card>
  );
}

export function MyBookingsView() {
  const bookings = useQuery(listMine, {}) as any[] | undefined;

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-12">
      <span className="eyebrow text-amber-dark">Account</span>
      <h1 className="display text-5xl text-ink">My bookings</h1>
      <div className="mt-8 grid gap-4">
        {bookings === undefined && <p className="text-body-2">Loading bookings...</p>}
        {bookings?.length === 0 && <p className="text-body-2">No bookings yet.</p>}
        {bookings?.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
