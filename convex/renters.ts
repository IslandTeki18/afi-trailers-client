import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isOperatorEmail, requireIdentity, requireRenter } from "./lib/auth";
import { MIN_RENTER_AGE } from "./rentalTerms";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const renter = await ctx.db
      .query("renters")
      .withIndex("by_clerk", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    return {
      ...(renter ?? {
        clerkUserId: identity.subject,
        email: identity.email ?? "",
        name: identity.name ?? "",
        phone: identity.phoneNumber ?? "",
      }),
      isOperator: isOperatorEmail(identity.email),
      hasSavedCard: Boolean(renter?.defaultPaymentMethodId),
    };
  },
});

export const upsertProfile = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    dob: v.string(),
    licenseNumber: v.string(),
    licenseStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const renter = await requireRenter(ctx);
    const name = args.name.trim();
    const phone = args.phone.trim();
    const licenseNumber = args.licenseNumber.trim();
    const today = new Date();
    const dob = new Date(`${args.dob}T00:00:00Z`);
    if (
      !name ||
      !phone ||
      !licenseNumber ||
      !/^\d{4}-\d{2}-\d{2}$/.test(args.dob) ||
      !Number.isFinite(dob.getTime()) ||
      dob.toISOString().slice(0, 10) !== args.dob ||
      dob > today
    ) {
      throw new ConvexError("INVALID_PROFILE");
    }

    if (MIN_RENTER_AGE > 0) {
      let age = today.getUTCFullYear() - dob.getUTCFullYear();
      if (
        today.getUTCMonth() < dob.getUTCMonth() ||
        (today.getUTCMonth() === dob.getUTCMonth() &&
          today.getUTCDate() < dob.getUTCDate())
      ) {
        age--;
      }
      if (age < MIN_RENTER_AGE) throw new ConvexError("UNDERAGE");
    }

    await ctx.db.patch(renter._id, {
      name,
      phone,
      dob: args.dob,
      licenseNumber,
      licenseStorageId: args.licenseStorageId,
    });
    return renter._id;
  },
});

export const generateLicenseUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireRenter(ctx);
    return ctx.storage.generateUploadUrl();
  },
});
