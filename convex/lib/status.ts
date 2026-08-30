import { ConvexError } from "convex/values";

export type BookingStatus =
  | "draft"
  | "qualified"
  | "signed"
  | "pending_payment"
  | "confirmed"
  | "payment_failed"
  | "checked_out"
  | "returned"
  | "closed"
  | "cancelled";

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  draft: ["qualified", "cancelled"],
  qualified: ["signed", "cancelled"],
  signed: ["pending_payment", "cancelled"],
  pending_payment: ["confirmed", "payment_failed", "cancelled"],
  confirmed: ["checked_out", "payment_failed", "cancelled"],
  payment_failed: ["pending_payment", "cancelled"],
  checked_out: ["returned"],
  returned: ["closed"],
  closed: [],
  cancelled: [],
};

export function assertTransition(from: BookingStatus, to: BookingStatus) {
  if (!TRANSITIONS[from].includes(to)) {
    throw new ConvexError(`INVALID_STATUS_TRANSITION:${from}:${to}`);
  }
}
