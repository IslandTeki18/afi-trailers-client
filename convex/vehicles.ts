import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireIdentity, requireRenter } from "./lib/auth";
import { qualifyVehicle } from "./qualification";

const vehicleFields = {
  year: v.number(),
  make: v.string(),
  model: v.string(),
  ballSize: v.union(v.literal("2"), v.literal("2-5/16")),
  connector: v.union(v.literal("4-pin"), v.literal("7-blade")),
  brakeController: v.union(
    v.literal("yes"),
    v.literal("no"),
    v.literal("unsure")
  ),
  receiver: v.union(
    v.literal("frame"),
    v.literal("bumper"),
    v.literal("unsure")
  ),
};

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const renter = await ctx.db
      .query("renters")
      .withIndex("by_clerk", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!renter) return [];
    return ctx.db
      .query("vehicles")
      .withIndex("by_renter", (q) => q.eq("renterId", renter._id))
      .order("desc")
      .collect();
  },
});

export const save = mutation({
  args: vehicleFields,
  handler: async (ctx, args) => {
    const renter = await requireRenter(ctx);
    const make = args.make.trim();
    const model = args.model.trim();
    if (!Number.isInteger(args.year) || !make || !model) {
      throw new ConvexError("INVALID_VEHICLE");
    }

    const qualification = qualifyVehicle({ ...args, make, model });
    const vehicleId = await ctx.db.insert("vehicles", {
      renterId: renter._id,
      ...args,
      make,
      model,
      ...qualification,
      lastUsedAt: Date.now(),
    });
    return { vehicleId, ...qualification };
  },
});

export const remove = mutation({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, { vehicleId }) => {
    const renter = await requireRenter(ctx);
    const vehicle = await ctx.db.get(vehicleId);
    if (!vehicle || vehicle.renterId !== renter._id) {
      throw new ConvexError("VEHICLE_NOT_FOUND");
    }
    await ctx.db.delete(vehicleId);
  },
});
