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

// Local calendar date; toISOString shifts the day for west-of-UTC evenings.
export function toInputDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function defaultDraft(): BookingDraft {
  const todayDate = new Date();
  const today = toInputDate(todayDate);
  const tomorrow = toInputDate(
    new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)
  );
  return {
    rentalType: "full",
    start: today,
    end: tomorrow,
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
