import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const ballSize = v.union(v.literal("2"), v.literal("2-5/16"));
const connector = v.union(v.literal("4-pin"), v.literal("7-blade"));
const yesNoUnsure = v.union(
  v.literal("yes"),
  v.literal("no"),
  v.literal("unsure")
);
const bookingStatus = v.union(
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
);

export default defineSchema({
  renters: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    dob: v.optional(v.string()),
    licenseStorageId: v.optional(v.id("_storage")),
    licenseNumber: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    defaultPaymentMethodId: v.optional(v.string()),
  })
    .index("by_clerk", ["clerkUserId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  vehicles: defineTable({
    renterId: v.id("renters"),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    ballSize,
    connector,
    brakeController: yesNoUnsure,
    receiver: v.union(
      v.literal("frame"),
      v.literal("bumper"),
      v.literal("unsure")
    ),
    outcome: v.union(
      v.literal("qualified"),
      v.literal("qualified_with_fix"),
      v.literal("not_qualified")
    ),
    fixes: v.array(v.string()),
    verifyAtHandoff: v.array(v.string()),
    lastUsedAt: v.number(),
  }).index("by_renter", ["renterId"]),

  bookings: defineTable({
    renterId: v.id("renters"),
    trailerId: v.string(),
    vehicleId: v.optional(v.id("vehicles")),
    serviceType: v.literal("self"),
    rentalType: v.union(v.literal("half"), v.literal("full")),
    start: v.number(),
    end: v.number(),
    quote: v.object({
      days: v.number(),
      dayRate: v.number(),
      base: v.number(),
      weekendSurcharge: v.number(),
      addOns: v.number(),
      total: v.number(),
    }),
    addOns: v.object({ adjustableHitch: v.boolean() }),
    load: v.optional(
      v.object({
        hauling: v.string(),
        towDistanceMiles: v.number(),
        dumpSite: v.string(),
      })
    ),
    status: bookingStatus,
    agreement: v.optional(
      v.object({
        version: v.string(),
        signedAt: v.number(),
        ip: v.string(),
        signatureName: v.string(),
        initials: v.record(v.string(), v.number()),
      })
    ),
    stripe: v.optional(
      v.object({
        customerId: v.string(),
        paymentIntentId: v.string(),
        paymentMethodId: v.optional(v.string()),
        depositIntentId: v.optional(v.string()),
        depositCaptureBefore: v.optional(v.number()),
        depositStatus: v.optional(
          v.union(
            v.literal("held"),
            v.literal("released"),
            v.literal("captured"),
            v.literal("failed"),
            v.literal("expired")
          )
        ),
        capturedAmount: v.optional(v.number()),
      })
    ),
    handoff: v.optional(
      v.object({
        completedAt: v.number(),
        operatorEmail: v.string(),
        checklist: v.record(v.string(), v.boolean()),
        renterSignatureName: v.string(),
        renterSignedAt: v.number(),
        verified: v.record(v.string(), v.string()),
        depositOverride: v.optional(v.boolean()),
      })
    ),
    return: v.optional(
      v.object({
        completedAt: v.number(),
        operatorEmail: v.string(),
        clean: v.boolean(),
        damageAmount: v.optional(v.number()),
        overageLbs: v.optional(v.number()),
        notes: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_renter", ["renterId"])
    .index("by_trailer_start", ["trailerId", "start"])
    .index("by_status", ["status"]),

  photos: defineTable({
    bookingId: v.id("bookings"),
    phase: v.union(v.literal("pickup"), v.literal("return")),
    storageId: v.id("_storage"),
    label: v.string(),
    takenAt: v.number(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    accuracy: v.optional(v.number()),
  }).index("by_booking_phase", ["bookingId", "phase"]),

  stripeEvents: defineTable({
    eventId: v.string(),
    type: v.string(),
    processedAt: v.number(),
  }).index("by_event_id", ["eventId"]),
});
