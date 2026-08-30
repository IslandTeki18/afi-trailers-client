export const AGREEMENT_VERSION = "2026-08-29-draft";
export const MIN_RENTER_AGE = 0; // TODO(owner): set to 25 once carrier confirms
export const DEPOSIT_AMOUNT_CENTS = 50_000; // TODO(owner): matches $500 in Additional Fees; confirm
export const OVERAGE_PER_LB_CENTS = 10; // TODO(owner): placeholder
export const ADJUSTABLE_HITCH_DAY_RATE_CENTS = 1_500; // TODO(owner): placeholder
export const MAX_LOAD_LBS_BY_TRAILER: Record<string, number> = {
  st7x14x4dump001: 10_000,
}; // TODO(owner): contracts say 6,000
export const LATE_FEE_CENTS = 5_000; // TODO(owner): site says $50/day; contract says $100/hour

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
