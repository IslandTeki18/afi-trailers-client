export function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

export const formatLbs = (lbs: number) => `${lbs.toLocaleString()} lb`;
