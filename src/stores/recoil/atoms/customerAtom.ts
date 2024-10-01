import { atom } from "recoil";

export const customerAtom = atom({
  key: "customerAtom",
  default: {
    id: null,
    name: "",
    email: "",
    phone: "",
  }, // Default customer information
});
