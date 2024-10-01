import { selector } from "recoil";
import { customerAtom } from "../atoms/customerAtom";

export const customerBookingHistorySelector = selector({
  key: "customerBookingHistorySelector",
  get: async ({ get }) => {
    const customer = get(customerAtom);
    // Fetch booking history from a backend or local storage
    const response = await fetch(`/api/bookings?customerId=${customer.id}`);
    return response.json();
  },
});
