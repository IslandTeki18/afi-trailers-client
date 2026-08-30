import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireOperator } from "./lib/auth";
import { HANDOFF_CHECKLIST, REQUIRED_PICKUP_PHOTOS } from "./rentalTerms";
import { assertTransition } from "./lib/status";

export const completeHandoff = mutation({
  args: {
    bookingId: v.id("bookings"),
    checklist: v.record(v.string(), v.boolean()),
    verified: v.record(v.string(), v.string()),
    renterSignatureName: v.string(),
    depositOverride: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const operator = await requireOperator(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking || booking.status !== "confirmed") {
      throw new ConvexError("BOOKING_NOT_HANDOFF_READY");
    }
    if (HANDOFF_CHECKLIST.some((key) => args.checklist[key] !== true)) {
      throw new ConvexError("HANDOFF_CHECKLIST_INCOMPLETE");
    }
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_booking_phase", (q) =>
        q.eq("bookingId", args.bookingId).eq("phase", "pickup")
      )
      .collect();
    if (photos.length < REQUIRED_PICKUP_PHOTOS) {
      throw new ConvexError("PICKUP_PHOTOS_INCOMPLETE");
    }
    if (
      booking.stripe?.depositStatus !== "held" &&
      args.depositOverride !== true
    ) {
      throw new ConvexError("DEPOSIT_NOT_HELD");
    }
    const signature = args.renterSignatureName.trim();
    if (!signature) throw new ConvexError("SIGNATURE_REQUIRED");

    assertTransition("confirmed", "checked_out");
    const now = Date.now();
    await ctx.db.patch(args.bookingId, {
      handoff: {
        completedAt: now,
        operatorEmail: operator.email ?? "unknown",
        checklist: args.checklist,
        verified: args.verified,
        renterSignatureName: signature,
        renterSignedAt: now,
        depositOverride: args.depositOverride,
      },
      status: "checked_out",
      updatedAt: now,
    });
  },
});
