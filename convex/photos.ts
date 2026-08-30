import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isOperatorEmail, requireIdentity, requireOperator } from "./lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireOperator(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const attach = mutation({
  args: {
    bookingId: v.id("bookings"),
    phase: v.union(v.literal("pickup"), v.literal("return")),
    storageId: v.id("_storage"),
    label: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    accuracy: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireOperator(ctx);
    if (!(await ctx.db.get(args.bookingId))) {
      throw new ConvexError("BOOKING_NOT_FOUND");
    }
    await ctx.db.insert("photos", {
      bookingId: args.bookingId,
      phase: args.phase,
      storageId: args.storageId,
      label: args.label,
      takenAt: Date.now(),
      lat: args.lat,
      lng: args.lng,
      accuracy: args.accuracy,
    });
  },
});

export const listForBooking = query({
  args: {
    bookingId: v.id("bookings"),
    phase: v.union(v.literal("pickup"), v.literal("return")),
  },
  handler: async (ctx, { bookingId, phase }) => {
    const identity = await requireIdentity(ctx);
    const booking = await ctx.db.get(bookingId);
    if (!booking) throw new ConvexError("BOOKING_NOT_FOUND");
    if (!isOperatorEmail(identity.email)) {
      const renter = await ctx.db.get(booking.renterId);
      if (!renter || renter.clerkUserId !== identity.subject) {
        throw new ConvexError("BOOKING_NOT_FOUND");
      }
    }
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_booking_phase", (q) =>
        q.eq("bookingId", bookingId).eq("phase", phase)
      )
      .collect();
    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );
  },
});
