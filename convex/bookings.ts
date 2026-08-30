import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { requireIdentity, requireOperator, requireRenter } from "./lib/auth";
import { assertTransition, type BookingStatus } from "./lib/status";
import {
  ADJUSTABLE_HITCH_DAY_RATE_CENTS,
  SELF_SERVICE_FULL_DAY_CENTS,
  SELF_SERVICE_HALF_DAY_CENTS,
  WEEKEND_SURCHARGE_CENTS,
  cancellationRefundCents,
} from "./rentalTerms";

const ACTIVE_STATUSES: BookingStatus[] = [
  "confirmed",
  "checked_out",
  "returned",
];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function quoteRental(
  rentalType: "half" | "full",
  start: number,
  end: number,
  adjustableHitch: boolean
) {
  const days =
    rentalType === "half" ? 1 : Math.max(1, Math.ceil((end - start) / MS_PER_DAY));
  const dayRate =
    rentalType === "half"
      ? SELF_SERVICE_HALF_DAY_CENTS
      : SELF_SERVICE_FULL_DAY_CENTS;
  let weekendDays = 0;
  for (let day = 0; day < days; day++) {
    const weekday = new Date(start + day * MS_PER_DAY).getUTCDay();
    if (weekday === 0 || weekday === 6) weekendDays++;
  }
  const base = days * dayRate;
  const weekendSurcharge = weekendDays * WEEKEND_SURCHARGE_CENTS;
  const addOns = adjustableHitch
    ? days * ADJUSTABLE_HITCH_DAY_RATE_CENTS
    : 0;
  return {
    days,
    dayRate,
    base,
    weekendSurcharge,
    addOns,
    total: base + weekendSurcharge + addOns,
  };
}

async function findOverlap(
  ctx: QueryCtx | MutationCtx,
  trailerId: string,
  from: number,
  to: number,
  exclude?: Id<"bookings">
) {
  const candidates = await ctx.db
    .query("bookings")
    .withIndex("by_trailer_start", (q) =>
      q.eq("trailerId", trailerId).lt("start", to)
    )
    .collect();
  return candidates.find(
    (booking) =>
      booking._id !== exclude &&
      booking.end > from &&
      ACTIVE_STATUSES.includes(booking.status)
  );
}

async function renterForIdentity(ctx: QueryCtx) {
  const identity = await requireIdentity(ctx);
  return ctx.db
    .query("renters")
    .withIndex("by_clerk", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
}

export const availability = query({
  args: { trailerId: v.string(), from: v.number(), to: v.number() },
  handler: async (ctx, { trailerId, from, to }) => {
    if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) {
      throw new ConvexError("INVALID_RENTAL_PERIOD");
    }
    const candidates = await ctx.db
      .query("bookings")
      .withIndex("by_trailer_start", (q) =>
        q.eq("trailerId", trailerId).lt("start", to)
      )
      .collect();
    return candidates
      .filter(
        (booking) =>
          booking.end > from && ACTIVE_STATUSES.includes(booking.status)
      )
      .map(({ start, end }) => [start, end] as [number, number]);
  },
});

export const createDraft = mutation({
  args: {
    bookingId: v.optional(v.id("bookings")),
    trailerId: v.string(),
    rentalType: v.union(v.literal("half"), v.literal("full")),
    start: v.number(),
    end: v.number(),
    vehicleId: v.id("vehicles"),
    adjustableHitch: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (
      !Number.isFinite(args.start) ||
      !Number.isFinite(args.end) ||
      args.start >= args.end
    ) {
      throw new ConvexError("INVALID_RENTAL_PERIOD");
    }
    const renter = await requireRenter(ctx);
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.renterId !== renter._id) {
      throw new ConvexError("VEHICLE_NOT_FOUND");
    }
    if (vehicle.outcome === "not_qualified") {
      throw new ConvexError("VEHICLE_NOT_QUALIFIED");
    }
    if (args.adjustableHitch && !vehicle.fixes.includes("adjustable_hitch")) {
      throw new ConvexError("INVALID_ADD_ON");
    }
    if (
      await findOverlap(
        ctx,
        args.trailerId,
        args.start,
        args.end,
        args.bookingId
      )
    ) {
      throw new ConvexError("DATES_UNAVAILABLE");
    }

    const quote = quoteRental(
      args.rentalType,
      args.start,
      args.end,
      args.adjustableHitch
    );
    const now = Date.now();
    if (args.bookingId) {
      const booking = await ctx.db.get(args.bookingId);
      if (
        !booking ||
        booking.renterId !== renter._id ||
        booking.status !== "qualified"
      ) {
        throw new ConvexError("BOOKING_NOT_EDITABLE");
      }
      await ctx.db.patch(booking._id, {
        trailerId: args.trailerId,
        vehicleId: vehicle._id,
        rentalType: args.rentalType,
        start: args.start,
        end: args.end,
        quote,
        addOns: { adjustableHitch: args.adjustableHitch },
        updatedAt: now,
      });
      await ctx.db.patch(vehicle._id, { lastUsedAt: now });
      return booking._id;
    }

    const bookingId = await ctx.db.insert("bookings", {
      renterId: renter._id,
      trailerId: args.trailerId,
      vehicleId: vehicle._id,
      serviceType: "self",
      rentalType: args.rentalType,
      start: args.start,
      end: args.end,
      quote,
      addOns: { adjustableHitch: args.adjustableHitch },
      status: "qualified",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(vehicle._id, { lastUsedAt: now });
    return bookingId;
  },
});

export const setLoad = mutation({
  args: {
    bookingId: v.id("bookings"),
    hauling: v.string(),
    towDistanceMiles: v.number(),
    dumpSite: v.string(),
    adjustableHitch: v.boolean(),
  },
  handler: async (ctx, args) => {
    const renter = await requireRenter(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (
      !booking ||
      booking.renterId !== renter._id ||
      booking.status !== "qualified" ||
      !booking.vehicleId
    ) {
      throw new ConvexError("BOOKING_NOT_EDITABLE");
    }
    const hauling = args.hauling.trim();
    const dumpSite = args.dumpSite.trim();
    if (
      !hauling ||
      !dumpSite ||
      !Number.isFinite(args.towDistanceMiles) ||
      args.towDistanceMiles < 0
    ) {
      throw new ConvexError("INVALID_LOAD");
    }
    const vehicle = await ctx.db.get(booking.vehicleId);
    if (
      args.adjustableHitch &&
      (!vehicle || !vehicle.fixes.includes("adjustable_hitch"))
    ) {
      throw new ConvexError("INVALID_ADD_ON");
    }
    await ctx.db.patch(booking._id, {
      load: { hauling, towDistanceMiles: args.towDistanceMiles, dumpSite },
      addOns: { adjustableHitch: args.adjustableHitch },
      quote: quoteRental(
        booking.rentalType,
        booking.start,
        booking.end,
        args.adjustableHitch
      ),
      updatedAt: Date.now(),
    });
  },
});

export const getMine = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const renter = await renterForIdentity(ctx);
    const booking = await ctx.db.get(bookingId);
    if (!renter || !booking || booking.renterId !== renter._id) {
      throw new ConvexError("BOOKING_NOT_FOUND");
    }
    return booking;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const renter = await renterForIdentity(ctx);
    if (!renter) return [];
    return ctx.db
      .query("bookings")
      .withIndex("by_renter", (q) => q.eq("renterId", renter._id))
      .order("desc")
      .collect();
  },
});

export const listForOperator = query({
  args: { from: v.number(), to: v.number() },
  handler: async (ctx, { from, to }) => {
    await requireOperator(ctx);
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.and(q.lt(q.field("start"), to), q.gt(q.field("end"), from)))
      .collect();
    return Promise.all(
      bookings.map(async (booking) => ({
        ...booking,
        renter: await ctx.db.get(booking.renterId),
        vehicle: booking.vehicleId ? await ctx.db.get(booking.vehicleId) : null,
      }))
    );
  },
});

export const setStatus = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("draft"),
      v.literal("qualified"),
      v.literal("signed"),
      v.literal("pending_payment"),
      v.literal("confirmed"),
      v.literal("payment_failed"),
      v.literal("checked_out"),
      v.literal("returned"),
      v.literal("closed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { bookingId, status }) => {
    const booking = await ctx.db.get(bookingId);
    if (!booking) throw new ConvexError("BOOKING_NOT_FOUND");
    assertTransition(booking.status, status);
    await ctx.db.patch(bookingId, { status, updatedAt: Date.now() });
  },
});

export const cancel = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const renter = await requireRenter(ctx);
    const booking = await ctx.db.get(bookingId);
    if (!booking || booking.renterId !== renter._id) {
      throw new ConvexError("BOOKING_NOT_FOUND");
    }
    assertTransition(booking.status, "cancelled");
    const refundAmount = cancellationRefundCents({
      start: booking.start,
      days: booking.quote.days,
      total: booking.quote.total,
      dayRate: booking.quote.dayRate,
    });
    await ctx.db.patch(bookingId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
    if (booking.status === "confirmed") {
      await ctx.scheduler.runAfter(0, internal.stripe.refundCancellation, {
        bookingId,
        amount: refundAmount,
      });
    }
    return { refundAmount };
  },
});
