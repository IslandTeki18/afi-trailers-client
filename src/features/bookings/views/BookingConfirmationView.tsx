import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card } from "~src/components";
import { PICKUP_ADDRESS } from "~convex/rentalTerms";
import { useBooking } from "~src/hooks/useBooking";
import { saveDraft } from "../utils/bookingDraft";

function pickupDate(start: number) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  }).format(new Date(start));
}

function toInputDate(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

export function BookingConfirmationView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = useBooking(bookingId);

  if (!bookingId || booking === undefined) {
    return (
      <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-20">
        <p className="text-body-2">Loading booking...</p>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-20">
        <p className="text-body-2">Booking not found.</p>
      </div>
    );
  }

  const retry = () => {
    saveDraft({
      bookingId,
      vehicleId: booking.vehicleId,
      rentalType: booking.rentalType,
      start: toInputDate(booking.start),
      end: toInputDate(booking.end),
      adjustableHitch: booking.addOns.adjustableHitch,
    });
    navigate(`/trailers/${booking.trailerId}/book/self?step=payment`);
  };

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-20">
      <span className="eyebrow text-amber-dark">Booking</span>
      <h1 className="display text-5xl sm:text-[66px] leading-[0.94] text-ink">
        {booking.status === "confirmed" ? "Pickup confirmed" : "Payment status"}
      </h1>

      <Card className="mt-8">
        {booking.status === "pending_payment" && (
          <p className="text-body-2">Confirming payment...</p>
        )}
        {booking.status === "confirmed" && (
          <div className="flex flex-col gap-4 text-body-2">
            <p>
              Pickup is {pickupDate(booking.start)} at {PICKUP_ADDRESS}.
            </p>
            <ul className="flex flex-col gap-2">
              <li>Bring your driver's license.</li>
              <li>Check tire condition on your truck before you leave.</li>
              <li>Expected hookup: 2-5/16 ball and 7-blade connector.</li>
              {booking.addOns.adjustableHitch && (
                <li>Adjustable hitch is included with your booking.</li>
              )}
            </ul>
            <p>You'll get a text and email shortly.</p>
          </div>
        )}
        {booking.status === "payment_failed" && (
          <div>
            <p className="mb-4 text-body-2">Payment failed. You can retry with another card.</p>
            <Button variant="amber" onClick={retry}>
              Retry payment
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
