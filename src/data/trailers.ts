import { Trailer } from "~src/types";
import { dumpTrailer } from "./dumpTrailer";

// ponytail: static fleet list; replace with an API call when a backend exists.
export const trailers: Trailer[] = [dumpTrailer];

export function findTrailer(trailerId: string | undefined): Trailer | undefined {
  return trailers.find((t) => t._id === trailerId);
}

export const trailerPath = (trailerId: string) => `/trailers/${trailerId}`;
export const bookingPath = (trailerId: string) =>
  `/trailers/${trailerId}/book`;

/** Booking entry point used by site-wide "Check dates" CTAs. */
export const primaryBookingPath = bookingPath(trailers[0]._id);
