import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";

const getMine = makeFunctionReference<"query", { bookingId: string }>(
  "bookings:getMine"
);

export function useBooking(bookingId?: string) {
  return useQuery(getMine, bookingId ? { bookingId } : "skip");
}
