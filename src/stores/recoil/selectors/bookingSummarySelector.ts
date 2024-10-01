import { selector } from "recoil";
import { bookingAtom } from "../atoms/bookingAtom";
import { customerAtom } from "../atoms/customerAtom";
import { pricingAtom } from "../atoms/pricingAtom";

export const bookingSummarySelector = selector({
  key: "bookingSummarySelector",
  get: ({ get }) => {
    const booking = get(bookingAtom);
    const customer = get(customerAtom);
    const pricing = get(pricingAtom);

    return {
      bookingDetails: booking,
      customerDetails: customer,
      totalPrice: pricing.total,
    };
  },
});
