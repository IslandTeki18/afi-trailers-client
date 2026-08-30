import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { assertTransition } from "./lib/status";

export const handle = internalMutation({
  args: { eventId: v.string(), type: v.string(), object: v.any() },
  handler: async (ctx, { eventId, type, object }) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", eventId))
      .unique();
    if (existing) return;
    await ctx.db.insert("stripeEvents", {
      eventId,
      type,
      processedAt: Date.now(),
    });

    if (type === "setup_intent.succeeded") return;
    const bookingId = ctx.db.normalizeId(
      "bookings",
      object.metadata?.bookingId
    );
    if (!bookingId) return;
    const booking = await ctx.db.get(bookingId);
    if (!booking) return;
    const kind = object.metadata?.kind;

    if (type === "payment_intent.succeeded" && kind === "rental_fee") {
      if (booking.status === "signed") {
        assertTransition("signed", "pending_payment");
        assertTransition("pending_payment", "confirmed");
      } else if (booking.status === "pending_payment") {
        assertTransition("pending_payment", "confirmed");
      } else if (booking.status !== "confirmed") {
        return;
      }
      const paymentMethodId =
        typeof object.payment_method === "string"
          ? object.payment_method
          : object.payment_method?.id;
      const customerId =
        typeof object.customer === "string"
          ? object.customer
          : object.customer?.id ?? booking.stripe?.customerId;
      if (!customerId) return;
      const shouldNotify = booking.status !== "confirmed";
      await ctx.db.patch(booking._id, {
        stripe: {
          ...booking.stripe,
          customerId,
          paymentIntentId: object.id,
          paymentMethodId,
        },
        status: "confirmed",
        updatedAt: Date.now(),
      });
      if (paymentMethodId) {
        await ctx.db.patch(booking.renterId, {
          defaultPaymentMethodId: paymentMethodId,
        });
        if (customerId) {
          await ctx.scheduler.runAfter(0, internal.stripe.setCustomerDefault, {
            customerId,
            paymentMethodId,
          });
        }
      }
      if (shouldNotify) {
        await ctx.scheduler.runAfter(
          0,
          internal.notifications.sendBookingConfirmation,
          { bookingId }
        );
      }
      return;
    }

    if (type === "payment_intent.payment_failed" && kind === "rental_fee") {
      if (booking.status === "signed" || booking.status === "pending_payment") {
        if (booking.status === "signed") {
          assertTransition("signed", "pending_payment");
        }
        assertTransition("pending_payment", "payment_failed");
        const customerId =
          typeof object.customer === "string"
            ? object.customer
            : object.customer?.id ?? booking.stripe?.customerId;
        await ctx.db.patch(booking._id, {
          stripe: customerId
            ? {
                ...booking.stripe,
                customerId,
                paymentIntentId: object.id,
              }
            : booking.stripe,
          status: "payment_failed",
          updatedAt: Date.now(),
        });
      }
      return;
    }

    if (
      type === "payment_intent.amount_capturable_updated" &&
      kind === "deposit_hold" &&
      booking.stripe
    ) {
      const captureBefore =
        object.capture_before ??
        object.latest_charge?.payment_method_details?.card?.capture_before;
      await ctx.db.patch(booking._id, {
        stripe: {
          ...booking.stripe,
          depositIntentId: object.id,
          depositStatus: "held",
          depositCaptureBefore: captureBefore
            ? captureBefore * 1000
            : booking.stripe.depositCaptureBefore,
        },
        updatedAt: Date.now(),
      });
      return;
    }

    if (
      type === "payment_intent.canceled" &&
      kind === "deposit_hold" &&
      booking.stripe
    ) {
      await ctx.db.patch(booking._id, {
        stripe: { ...booking.stripe, depositStatus: "released" },
        updatedAt: Date.now(),
      });
    }
  },
});
