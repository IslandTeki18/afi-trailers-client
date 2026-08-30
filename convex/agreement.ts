import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { assertTransition } from "./lib/status";
import {
  AGREEMENT_INITIALS,
  AGREEMENT_VERSION,
  LOAD_SPECIFIC_INITIAL_KEYS,
} from "./rentalTerms";

export const renterIdForClerk = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) =>
    ctx.db
      .query("renters")
      .withIndex("by_clerk", (q) => q.eq("clerkUserId", clerkUserId))
      .unique(),
});

export const sign = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    renterId: v.id("renters"),
    signatureName: v.string(),
    initials: v.record(v.string(), v.string()),
    ip: v.string(),
  },
  handler: async (ctx, args) => {
    const [booking, renter] = await Promise.all([
      ctx.db.get(args.bookingId),
      ctx.db.get(args.renterId),
    ]);
    if (!booking || booking.renterId !== args.renterId || !renter) {
      throw new ConvexError("BOOKING_NOT_FOUND");
    }
    if (booking.status !== "qualified") {
      throw new ConvexError("BOOKING_NOT_SIGNABLE");
    }
    if (!booking.vehicleId || !booking.load) {
      throw new ConvexError("BOOKING_INCOMPLETE");
    }
    const vehicle = await ctx.db.get(booking.vehicleId);
    if (!vehicle || vehicle.outcome === "not_qualified") {
      throw new ConvexError("VEHICLE_NOT_QUALIFIED");
    }
    if (
      !renter.name.trim() ||
      !renter.phone.trim() ||
      !renter.licenseNumber ||
      !renter.licenseStorageId
    ) {
      throw new ConvexError("PROFILE_INCOMPLETE");
    }
    if (
      args.signatureName.trim().toLowerCase() !== renter.name.trim().toLowerCase()
    ) {
      throw new ConvexError("SIGNATURE_NAME_MISMATCH");
    }

    const priorBookings = await ctx.db
      .query("bookings")
      .withIndex("by_renter", (q) => q.eq("renterId", renter._id))
      .collect();
    const returning = priorBookings.some(
      (prior) =>
        prior._id !== booking._id &&
        prior.vehicleId === booking.vehicleId &&
        prior.agreement?.version === AGREEMENT_VERSION
    );
    const requiredKeys = returning
      ? LOAD_SPECIFIC_INITIAL_KEYS
      : AGREEMENT_INITIALS.map(({ key }) => key);
    if (
      requiredKeys.some(
        (key) => !/^[A-Za-z]{2,3}$/.test(args.initials[key]?.trim() ?? "")
      )
    ) {
      throw new ConvexError("INITIALS_REQUIRED");
    }

    const now = Date.now();
    assertTransition(booking.status, "signed");
    await ctx.db.patch(booking._id, {
      agreement: {
        version: AGREEMENT_VERSION,
        signedAt: now,
        ip: args.ip,
        signatureName: args.signatureName.trim(),
        initials: Object.fromEntries(requiredKeys.map((key) => [key, now])),
      },
      status: "signed",
      updatedAt: now,
    });
  },
});
