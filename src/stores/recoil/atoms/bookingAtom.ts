import { atom } from "recoil";

export const bookingAtom = atom({
  key: "bookingAtom",
  default: {
    date: null,
    trailerId: null,
    customerId: null,
    duration: null,
  }, // Initial booking details
});
