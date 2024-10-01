import { selector } from "recoil";
import { pricingAtom } from "../atoms/pricingAtom";

export const pricingSelector = selector({
  key: "pricingSelector",
  get: ({ get }) => {
    const pricing = get(pricingAtom);
    // Apply some pricing logic or discount calculations
    return pricing.baseRate - pricing.durationDiscount;
  },
});
