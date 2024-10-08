import { Trailer } from "~src/types";

export function calculateTotalPrice(
  trailer: Trailer,
  startDate: Date,
  endDate: Date
): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.ceil(diffInTime / oneDay);

  let totalPrice = diffInDays * (trailer.fullDayRentalPrice || 0);

  const includesWeekend = [0, 6].some((weekDay) =>
    isDateInRangeContainsWeekday(startDate, endDate, weekDay)
  );

  if (includesWeekend && trailer.weekendSurcharge) {
    totalPrice += trailer.weekendSurcharge;
  }

  return totalPrice;
}

function isDateInRangeContainsWeekday(
  start: Date,
  end: Date,
  weekDay: number
): boolean {
  const current = new Date(start);
  while (current <= end) {
    if (current.getDay() === weekDay) return true;
    current.setDate(current.getDate() + 1);
  }
  return false;
}
