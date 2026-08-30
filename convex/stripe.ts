"use node";

import Stripe from "stripe";
import { ConvexError, v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireIdentity, requireOperator } from "./lib/auth";
import {
  DEPOSIT_AMOUNT_CENTS,
  OVERAGE_PER_LB_CENTS,
  REQUIRED_PICKUP_PHOTOS,
} from "./rentalTerms";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

const captureBefore = (intent: Stripe.PaymentIntent) => {
  const charge =
    typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  return charge?.payment_method_details?.card?.capture_before
    ? charge.payment_method_details.card.capture_before * 1000
    : undefined;
};

export const createCheckout = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const identity = await requireIdentity(ctx);
    const { booking, renter } = await ctx.runQuery(
      internal.stripeData.bookingContext,
      { bookingId, clerkUserId: identity.subject }
    );
    if (booking.status !== "signed" && booking.status !== "pending_payment") {
      throw new ConvexError("BOOKING_NOT_PAYABLE");
    }

    let customerId = renter.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create(
        {
          email: renter.email || undefined,
          name: renter.name || undefined,
          phone: renter.phone || undefined,
          metadata: { clerkUserId: renter.clerkUserId },
        },
        { idempotencyKey: `cust_${renter.clerkUserId}` }
      );
      customerId = customer.id;
      await ctx.runMutation(internal.stripeData.saveCustomer, {
        renterId: renter._id,
        customerId,
      });
    }

    if (booking.stripe?.paymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(
        booking.stripe.paymentIntentId
      );
      if (existing.status !== "succeeded" && existing.client_secret) {
        return {
          clientSecret: existing.client_secret,
          depositAmount: DEPOSIT_AMOUNT_CENTS,
        };
      }
    }

    const intent = await stripe.paymentIntents.create(
      {
        amount: booking.quote.total,
        currency: "usd",
        customer: customerId,
        setup_future_usage: "off_session",
        automatic_payment_methods: { enabled: true },
        metadata: { bookingId, kind: "rental_fee" },
        description: `Rental Fee ${booking.trailerId} ${new Date(booking.start).toISOString()}`,
      },
      { idempotencyKey: `rent_${bookingId}` }
    );
    if (!intent.client_secret) throw new ConvexError("PAYMENT_SETUP_FAILED");
    await ctx.runMutation(internal.stripeData.saveCheckout, {
      bookingId,
      customerId,
      paymentIntentId: intent.id,
    });
    return {
      clientSecret: intent.client_secret,
      depositAmount: DEPOSIT_AMOUNT_CENTS,
    };
  },
});

export const placeDepositHold = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    await requireOperator(ctx);
    const { booking, renter } = await ctx.runQuery(
      internal.stripeData.bookingContext,
      { bookingId }
    );
    if (
      booking.status !== "confirmed" ||
      !renter.stripeCustomerId ||
      !renter.defaultPaymentMethodId
    ) {
      throw new ConvexError("BOOKING_NOT_READY_FOR_HOLD");
    }

    try {
      const intent = await stripe.paymentIntents.create(
        {
          amount: DEPOSIT_AMOUNT_CENTS,
          currency: "usd",
          customer: renter.stripeCustomerId,
          payment_method: renter.defaultPaymentMethodId,
          capture_method: "manual",
          off_session: true,
          confirm: true,
          expand: ["latest_charge"],
          metadata: { bookingId, kind: "deposit_hold" },
        },
        { idempotencyKey: `hold_${bookingId}` }
      );
      const before = captureBefore(intent);
      await ctx.runMutation(internal.stripeData.saveDeposit, {
        bookingId,
        depositIntentId: intent.id,
        depositCaptureBefore: before,
        depositStatus: "held",
      });
      return { ok: true as const, captureBefore: before };
    } catch (error) {
      await ctx.runMutation(internal.stripeData.saveDeposit, {
        bookingId,
        depositStatus: "failed",
      });
      return {
        ok: false as const,
        reason: error instanceof Error ? error.message : "Deposit hold failed",
      };
    }
  },
});

async function createInvoiceFallback(
  customerId: string,
  bookingId: string,
  amount: number,
  reason: string
) {
  const invoice = await stripe.invoices.create(
    { customer: customerId, metadata: { bookingId, reason } },
    { idempotencyKey: `invoice_${bookingId}_${amount}` }
  );
  await stripe.invoiceItems.create(
    {
      customer: customerId,
      invoice: invoice.id,
      amount,
      currency: "usd",
      description: reason,
    },
    { idempotencyKey: `invoice_item_${bookingId}_${amount}` }
  );
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
  return finalized.hosted_invoice_url;
}

async function chargeOffSession({
  bookingId,
  amount,
  customerId,
  paymentMethod,
  description,
}: {
  bookingId: string;
  amount: number;
  customerId: string;
  paymentMethod: string;
  description: string;
}) {
  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
        metadata: { bookingId, kind: "damage" },
        description,
      },
      { idempotencyKey: `dmg_${bookingId}_${amount}` }
    );
    return { charged: intent.amount_received, invoiceUrl: null };
  } catch (error) {
    return {
      charged: 0,
      invoiceUrl: await createInvoiceFallback(
        customerId,
        bookingId,
        amount,
        error instanceof Error ? error.message : description
      ),
    };
  }
}

export const settleReturn = action({
  args: {
    bookingId: v.id("bookings"),
    clean: v.boolean(),
    damageAmount: v.number(),
    overageLbs: v.number(),
    notes: v.optional(v.string()),
    photoIds: v.array(v.id("photos")),
  },
  handler: async (ctx, args) => {
    const operator = await requireOperator(ctx);
    const { booking, renter, photos } = await ctx.runQuery(
      internal.stripeData.bookingContext,
      { bookingId: args.bookingId }
    );
    if (booking.status !== "checked_out" || photos.length < REQUIRED_PICKUP_PHOTOS) {
      throw new ConvexError("RETURN_INCOMPLETE");
    }
    if (
      !Number.isInteger(args.damageAmount) ||
      args.damageAmount < 0 ||
      !Number.isInteger(args.overageLbs) ||
      args.overageLbs < 0 ||
      (args.clean && (args.damageAmount > 0 || args.overageLbs > 0))
    ) {
      throw new ConvexError("INVALID_RETURN_CHARGES");
    }
    if (
      args.photoIds.some(
        (photoId) => !photos.some((photo) => photo._id === photoId)
      )
    ) {
      throw new ConvexError("INVALID_RETURN_PHOTO");
    }

    const total = args.damageAmount + args.overageLbs * OVERAGE_PER_LB_CENTS;
    const deposit = booking.stripe;
    if (!deposit || !renter.stripeCustomerId || !renter.defaultPaymentMethodId) {
      throw new ConvexError("PAYMENT_METHOD_NOT_FOUND");
    }
    const description = `Damage/overage; photos: ${args.photoIds.join(",")}`;
    let depositStatus: "released" | "captured" | "expired" = "expired";
    let capturedAmount = 0;
    let chargedAmount = 0;
    let invoiceUrl: string | null = null;
    const holdActive =
      deposit.depositStatus === "held" &&
      deposit.depositIntentId &&
      deposit.depositCaptureBefore &&
      Date.now() < deposit.depositCaptureBefore;

    if (holdActive && deposit.depositIntentId) {
      if (total === 0) {
        await stripe.paymentIntents.cancel(deposit.depositIntentId);
        depositStatus = "released";
      } else {
        capturedAmount = Math.min(total, DEPOSIT_AMOUNT_CENTS);
        await stripe.paymentIntents.update(deposit.depositIntentId, {
          description,
        });
        await stripe.paymentIntents.capture(deposit.depositIntentId, {
          amount_to_capture: capturedAmount,
        });
        depositStatus = "captured";
      }
    }

    const remainder = total - capturedAmount;
    if (remainder > 0) {
      const charge = await chargeOffSession({
        bookingId: args.bookingId,
        amount: remainder,
        customerId: renter.stripeCustomerId,
        paymentMethod: renter.defaultPaymentMethodId,
        description,
      });
      chargedAmount = charge.charged;
      invoiceUrl = charge.invoiceUrl;
    }

    await ctx.runMutation(internal.stripeData.completeReturn, {
      bookingId: args.bookingId,
      operatorEmail: operator.email ?? "unknown",
      clean: args.clean,
      damageAmount: args.damageAmount || undefined,
      overageLbs: args.overageLbs || undefined,
      notes: args.notes?.trim() || undefined,
      depositStatus,
      capturedAmount: capturedAmount || undefined,
    });
    return { depositStatus, capturedAmount, chargedAmount, invoiceUrl };
  },
});

export const sendInvoiceFallback = action({
  args: {
    bookingId: v.id("bookings"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOperator(ctx);
    if (!Number.isInteger(args.amount) || args.amount <= 0) {
      throw new ConvexError("INVALID_AMOUNT");
    }
    const { renter } = await ctx.runQuery(internal.stripeData.bookingContext, {
      bookingId: args.bookingId,
    });
    if (!renter.stripeCustomerId) throw new ConvexError("CUSTOMER_NOT_FOUND");
    return createInvoiceFallback(
      renter.stripeCustomerId,
      args.bookingId,
      args.amount,
      args.reason
    );
  },
});

export const chargeAdditional = action({
  args: {
    bookingId: v.id("bookings"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOperator(ctx);
    if (!Number.isInteger(args.amount) || args.amount <= 0) {
      throw new ConvexError("INVALID_AMOUNT");
    }
    const { renter } = await ctx.runQuery(internal.stripeData.bookingContext, {
      bookingId: args.bookingId,
    });
    if (!renter.stripeCustomerId || !renter.defaultPaymentMethodId) {
      throw new ConvexError("PAYMENT_METHOD_NOT_FOUND");
    }
    return chargeOffSession({
      bookingId: args.bookingId,
      amount: args.amount,
      customerId: renter.stripeCustomerId,
      paymentMethod: renter.defaultPaymentMethodId,
      description: args.reason,
    });
  },
});

export const refundCancellation = internalAction({
  args: { bookingId: v.id("bookings"), amount: v.number() },
  handler: async (ctx, { bookingId, amount }) => {
    if (amount <= 0) return;
    const { booking } = await ctx.runQuery(internal.stripeData.bookingContext, {
      bookingId,
    });
    if (!booking.stripe?.paymentIntentId) {
      throw new ConvexError("PAYMENT_INTENT_NOT_FOUND");
    }
    await stripe.refunds.create(
      { payment_intent: booking.stripe.paymentIntentId, amount },
      { idempotencyKey: `cancel_${bookingId}_${amount}` }
    );
  },
});

export const setCustomerDefault = internalAction({
  args: { customerId: v.string(), paymentMethodId: v.string() },
  handler: async (_, { customerId, paymentMethodId }) => {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  },
});
