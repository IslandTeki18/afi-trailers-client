import { ConvexError } from "convex/values";
import type { MutationCtx } from "../_generated/server";

type AuthContext = Pick<MutationCtx, "auth">;

export async function requireIdentity(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("UNAUTHENTICATED");
  return identity;
}

export async function requireRenter(ctx: MutationCtx) {
  const identity = await requireIdentity(ctx);
  const existing = await ctx.db
    .query("renters")
    .withIndex("by_clerk", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (existing) return existing;

  const renterId = await ctx.db.insert("renters", {
    clerkUserId: identity.subject,
    email: identity.email ?? "",
    name: identity.name ?? "",
    phone: identity.phoneNumber ?? "",
  });
  return (await ctx.db.get(renterId))!;
}

export function isOperatorEmail(email?: string) {
  const normalized = email?.trim().toLowerCase();
  return Boolean(
    normalized &&
      (process.env.OPERATOR_EMAILS ?? "")
        .split(",")
        .some((value) => value.trim().toLowerCase() === normalized)
  );
}

export async function requireOperator(ctx: AuthContext) {
  const identity = await requireIdentity(ctx);
  if (!isOperatorEmail(identity.email)) throw new ConvexError("NOT_OPERATOR");
  return identity;
}
