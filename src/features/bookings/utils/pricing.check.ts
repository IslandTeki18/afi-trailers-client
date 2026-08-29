// Run: npm run check
import assert from "node:assert/strict";
import { quoteRental } from "./pricing.ts";

const trailer = {
  rentalPrices: { halfDay: 60, fullDay: 80 },
  deliveryFee: 20,
  weekendSurcharge: 25,
};

// Sat Sep 12 2026 -> Sun Sep 13 2026, self service: 1 full day + 1 weekend day (design example: $105)
const sat = new Date(2026, 8, 12);
const sun = new Date(2026, 8, 13);
assert.deepEqual(quoteRental(trailer, sat, sun, "full", "self"), {
  days: 1, weekendDays: 1, dayRate: 80, base: 80, weekendSurcharge: 25, deliveryFee: 0, total: 105,
});

// Same dates, full service adds the flat delivery fee once.
assert.equal(quoteRental(trailer, sat, sun, "full", "full").total, 125);

// Fri -> Mon: 3 days, Fri/Sat/Sun rental days -> 2 weekend days.
const fri = new Date(2026, 8, 11);
const mon = new Date(2026, 8, 14);
assert.deepEqual(quoteRental(trailer, fri, mon, "full", "self"), {
  days: 3, weekendDays: 2, dayRate: 80, base: 240, weekendSurcharge: 50, deliveryFee: 0, total: 290,
});

// Half day on a weekday: half-day rate, no surcharge.
const wed = new Date(2026, 8, 16);
assert.equal(quoteRental(trailer, wed, wed, "half", "self").total, 60);

// Same-day full rental still bills one day.
assert.equal(quoteRental(trailer, wed, wed, "full", "self").days, 1);

console.log("pricing.check: ok");
