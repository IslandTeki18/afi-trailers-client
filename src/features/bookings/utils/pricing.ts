import type { Trailer, RentalType, ServiceType } from "../../../types/Trailer";

export type Quote = {
  days: number;
  weekendDays: number;
  dayRate: number;
  base: number;
  weekendSurcharge: number;
  deliveryFee: number;
  total: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

/** Number of rental days between two dates, minimum 1. Half-day rentals are always 1. */
export function rentalDays(start: Date, end: Date, rentalType: RentalType): number {
  if (rentalType === "half") return 1;
  const diff = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
  return Math.max(1, diff);
}

export function quoteRental(
  trailer: Pick<Trailer, "rentalPrices" | "deliveryFee" | "weekendSurcharge">,
  start: Date,
  end: Date,
  rentalType: RentalType,
  serviceType: ServiceType
): Quote {
  const days = rentalDays(start, end, rentalType);
  const dayRate =
    rentalType === "half"
      ? trailer.rentalPrices.halfDay ?? trailer.rentalPrices.fullDay
      : trailer.rentalPrices.fullDay;

  let weekendDays = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (isWeekend(d)) weekendDays++;
  }

  const base = days * dayRate;
  const weekendSurcharge = weekendDays * (trailer.weekendSurcharge ?? 0);
  // ponytail: delivery is one flat fee per rental, per the contract text.
  const deliveryFee = serviceType === "full" ? trailer.deliveryFee : 0;

  return {
    days,
    weekendDays,
    dayRate,
    base,
    weekendSurcharge,
    deliveryFee,
    total: base + weekendSurcharge + deliveryFee,
  };
}
