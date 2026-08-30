import * as React from "react";
import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "~src/components";
import { DEPOSIT_AMOUNT_CENTS } from "~convex/rentalTerms";
import { formatMoney } from "~src/utils";
import { clearDraft } from "../../utils/bookingDraft";
import { useBooking } from "~src/hooks/useBooking";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
const createCheckout = makeFunctionReference<"action", { bookingId: string }>(
  "stripe:createCheckout"
);

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const booking = useBooking(bookingId);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const confirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError("");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.SITE_URL}/bookings/${bookingId}/confirmation`,
      },
      redirect: "if_required",
    });
    setPaying(false);
    if (result.error) {
      setError(result.error.message ?? "Payment failed.");
      return;
    }
    clearDraft();
    navigate(`/bookings/${bookingId}/confirmation`);
  };

  return (
    <form onSubmit={confirm} className="flex flex-col gap-5">
      {booking && (
        <Card>
          <dl>
            <div className="flex justify-between py-2 border-b border-rule">
              <dt>Rental Fee</dt>
              <dd>{formatMoney(booking.quote.base / 100)}</dd>
            </div>
            {booking.quote.weekendSurcharge > 0 && (
              <div className="flex justify-between py-2 border-b border-rule">
                <dt>Weekend surcharge</dt>
                <dd>{formatMoney(booking.quote.weekendSurcharge / 100)}</dd>
              </div>
            )}
            {booking.quote.addOns > 0 && (
              <div className="flex justify-between py-2 border-b border-rule">
                <dt>Adjustable hitch</dt>
                <dd>{formatMoney(booking.quote.addOns / 100)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-3 font-semibold text-ink">
              <dt>Total charged today</dt>
              <dd>{formatMoney(booking.quote.total / 100)}</dd>
            </div>
          </dl>
        </Card>
      )}

      <div className="border border-rule-2 p-4 text-[14px] leading-relaxed text-body-2">
        <strong className="text-ink">
          Security Deposit: {formatMoney(DEPOSIT_AMOUNT_CENTS / 100)}
        </strong>{" "}
        hold placed at pickup, not today. It is a hold, not a charge. On a debit
        card the bank removes the amount from your available balance until we
        release it, usually within a few days of return.
      </div>

      <PaymentElement />
      {error && (
        <p className="text-sm text-rust" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="amber" disabled={!stripe || paying}>
        {paying ? "Processing..." : "Pay rental fee"}
      </Button>
    </form>
  );
}

export function PaymentStep({ bookingId }: { bookingId: string }) {
  const checkout = useAction(createCheckout);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void checkout({ bookingId })
      .then((result: any) => {
        if (!cancelled) setClientSecret(result.clientSecret);
      })
      .catch((nextError) => {
        console.error(nextError);
        if (!cancelled) setError("Payment setup failed.");
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId, checkout]);

  if (error) {
    return (
      <p className="text-sm text-rust" role="alert">
        {error}
      </p>
    );
  }
  if (!clientSecret) return <p className="text-body-2">Preparing payment...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm bookingId={bookingId} />
    </Elements>
  );
}
