export const AGREEMENT_VERSION = "2026-08-29-draft";
export const MIN_RENTER_AGE = 0; // TODO(owner): set to 25 once carrier confirms
export const DEPOSIT_AMOUNT_CENTS = 50_000; // TODO(owner): matches $500 in Additional Fees; confirm
export const OVERAGE_PER_LB_CENTS = 10; // TODO(owner): placeholder
export const ADJUSTABLE_HITCH_DAY_RATE_CENTS = 1_500; // TODO(owner): placeholder
export const MAX_LOAD_LBS_BY_TRAILER: Record<string, number> = {
  st7x14x4dump001: 10_000,
}; // TODO(owner): contracts say 6,000
export const LATE_FEE_CENTS = 5_000; // TODO(owner): site says $50/day; contract says $100/hour
export const SELF_SERVICE_HALF_DAY_CENTS = 6_000; // TODO(owner): confirm before launch
export const SELF_SERVICE_FULL_DAY_CENTS = 8_000; // TODO(owner): confirm before launch
export const WEEKEND_SURCHARGE_CENTS = 2_500; // TODO(owner): confirm before launch
export const HALF_DAY_RENTAL_MS = 5 * 60 * 60 * 1000; // 5 hours from pickup
export const PICKUP_ADDRESS = "Spanish Fork, UT"; // TODO(owner): replace with exact pickup address before launch

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function quoteSelfServiceRental(
  rentalType: "half" | "full",
  start: number,
  end: number,
  adjustableHitch: boolean
) {
  const days =
    rentalType === "half" ? 1 : Math.max(1, Math.ceil((end - start) / MS_PER_DAY));
  const dayRate =
    rentalType === "half"
      ? SELF_SERVICE_HALF_DAY_CENTS
      : SELF_SERVICE_FULL_DAY_CENTS;
  let weekendDays = 0;
  for (let day = 0; day < days; day++) {
    const weekday = new Date(start + day * MS_PER_DAY).getUTCDay();
    if (weekday === 0 || weekday === 6) weekendDays++;
  }
  const base = days * dayRate;
  const weekendSurcharge = weekendDays * WEEKEND_SURCHARGE_CENTS;
  const addOns = adjustableHitch ? days * ADJUSTABLE_HITCH_DAY_RATE_CENTS : 0;
  return {
    days,
    dayRate,
    base,
    weekendSurcharge,
    addOns,
    total: base + weekendSurcharge + addOns,
  };
}

export function cancellationRefundCents({
  start,
  days,
  total,
  dayRate,
  now = Date.now(),
}: {
  start: number;
  days: number;
  total: number;
  dayRate: number;
  now?: number;
}) {
  const hoursBeforeStart = (start - now) / (60 * 60 * 1000);
  if (hoursBeforeStart <= 0) return 0;
  if (days === 1) {
    return hoursBeforeStart >= 24 ? total : total - Math.ceil(dayRate / 2);
  }
  return hoursBeforeStart >= 48 ? total : Math.max(0, total - dayRate);
}

export const AGREEMENT_INITIALS = [
  {
    key: "max_weight",
    text: `I will not exceed the trailer's ${MAX_LOAD_LBS_BY_TRAILER.st7x14x4dump001.toLocaleString()} lb maximum load.`,
  },
  {
    key: "towing_requirements",
    text: "My Tow Vehicle meets the stated hitch, connector, brake, and receiver requirements.",
  },
  {
    key: "condition_report",
    text: "I accept the pickup Condition Report and responsibility for new damage at Return.",
  },
  {
    key: "deposit_hold",
    text: `I authorize a $${(DEPOSIT_AMOUNT_CENTS / 100).toFixed(2)} Security Deposit hold at Handoff.`,
  },
  {
    key: "fees",
    text: `I authorize documented damage, overage at $${(OVERAGE_PER_LB_CENTS / 100).toFixed(2)}/lb, and applicable late fees.`,
  },
] as const;

export const LOAD_SPECIFIC_INITIAL_KEYS = ["max_weight"] as const;
export const REQUIRED_PICKUP_PHOTOS = 8;
export const REQUIRED_RETURN_PHOTOS = 8;
export const PHOTO_LABELS = [
  "front",
  "rear",
  "left",
  "right",
  "tarp",
  "bed-floor",
  "gate",
  "tongue-coupler",
  "tires-left",
  "tires-right",
] as const;
export const HANDOFF_CHECKLIST = [
  "license_matches",
  "hitch_ok",
  "ball_ok",
  "connector_ok",
  "chains_crossed",
  "lights_cycle",
] as const;
