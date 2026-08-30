import type { RentalType } from "~src/types";

export type BookingDraft = {
  vehicleId?: string;
  bookingId?: string;
  rentalType: RentalType;
  start: string;
  end: string;
  adjustableHitch: boolean;
};

const key = "afi.booking.draft";

export function defaultDraft(): BookingDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    rentalType: "full",
    start: today,
    end: today,
    adjustableHitch: false,
  };
}

export function loadDraft(): BookingDraft {
  if (typeof sessionStorage === "undefined") return defaultDraft();
  try {
    return { ...defaultDraft(), ...JSON.parse(sessionStorage.getItem(key) ?? "{}") };
  } catch {
    return defaultDraft();
  }
}

export function saveDraft(draft: BookingDraft) {
  sessionStorage.setItem(key, JSON.stringify(draft));
}

export function clearDraft() {
  sessionStorage.removeItem(key);
}
