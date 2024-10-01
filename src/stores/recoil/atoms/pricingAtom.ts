import { atom } from "recoil";

export const pricingAtom = atom({
  key: "pricingAtom",
  default: {
    baseRate: 0,
    durationDiscount: 0,
    total: 0,
  }, // Pricing information
});
