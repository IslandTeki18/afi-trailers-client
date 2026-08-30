import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { assertTransition } from "./lib/status";

export const bookingContext = internalQuery({
  args: { bookingId: v.id("bookings"), clerkUserId: v.optional(v.string()) },
  handler: async (ctx, { bookingId, clerkUserId }) => {
    const booking = await ctx.db.get(bookingId);
    if (!booking) throw new ConvexError("BOOKING_NOT_FOUND");
    const renter = await ctx.db.get(booking.renterId);
    if (!renter || (clerkUserId && renter.clerkUserId !== clerkUserId)) {
      throw new ConvexError("BOOKING_NOT_FOUND");
    }
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_booking_phase", (q) =>
        q.eq("bookingId", bookingId).eq("phase", "return")
      )
      .collect();
    return { booking, renter, photos };
  },
});

export const saveCustomer = internalMutation({
  args: { renterId: v.id("renters"), customerId: v.string() },
  handler: async (ctx, { renterId, customerId }) => {
    const renter = await ctx.db.get(renterId);
    if (!renter) throw new ConvexError("RENTER_NOT_FOUND");
    await ctx.db.patch(renterId, { stripeCustomerId: customerId });
  },
});

export const saveCheckout = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    customerId: v.string(),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new ConvexError("BOOKING_NOT_FOUND");
    if (booking.status === "signed") assertTransition("signed", "pending_payment");
    else if (booking.status !== "pending_payment") {
      throw new ConvexError("BOOKING_NOT_PAYABLE");
    }
    await ctx.db.patch(booking._id, {
      stripe: {
        ...booking.stripe,
        customerId: args.customerId,
        paymentIntentId: args.paymentIntentId,
      },
      status: "pending_payment",
      updatedAt: Date.now(),
    });
  },
});

export const saveDeposit = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    depositIntentId: v.optional(v.string()),
    depositCaptureBefore: v.optional(v.number()),
    depositStatus: v.union(v.literal("held"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking?.stripe) throw new ConvexError("BOOKING_NOT_PAID");
    await ctx.db.patch(booking._id, {
      stripe: {
        ...booking.stripe,
        depositIntentId: args.depositIntentId,
        depositCaptureBefore: args.depositCaptureBefore,
        depositStatus: args.depositStatus,
      },
      updatedAt: Date.now(),
    });
  },
});

export const completeReturn = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    operatorEmail: v.string(),
    clean: v.boolean(),
    damageAmount: v.optional(v.number()),
    overageLbs: v.optional(v.number()),
    notes: v.optional(v.string()),
    depositStatus: v.optional(
      v.union(
        v.literal("released"),
        v.literal("captured"),
        v.literal("expired")
      )
    ),
    capturedAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking?.stripe || booking.status !== "checked_out") {
      throw new ConvexError("BOOKING_NOT_RETURNABLE");
    }
    const now = Date.now();
    assertTransition("checked_out", "returned");
    assertTransition("returned", "closed");
    await ctx.db.patch(booking._id, {
      stripe: {
        ...booking.stripe,
        depositStatus: args.depositStatus ?? booking.stripe.depositStatus,
        capturedAmount: args.capturedAmount,
      },
      return: {
        completedAt: now,
        operatorEmail: args.operatorEmail,
        clean: args.clean,
        damageAmount: args.damageAmount,
        overageLbs: args.overageLbs,
        notes: args.notes,
      },
      status: "closed",
      updatedAt: now,
    });
  },
});
