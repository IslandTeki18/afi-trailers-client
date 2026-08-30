import * as React from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Button, Card, Input } from "~src/components";
import type { Trailer } from "~src/types";
import { classNames, formatLbs, formatMoney } from "~src/utils";
import {
  ADJUSTABLE_HITCH_DAY_RATE_CENTS,
  OVERAGE_PER_LB_CENTS,
} from "~convex/rentalTerms";
import type { BookingDraft } from "../../utils/bookingDraft";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const availabilityQuery = makeFunctionReference<
  "query",
  { trailerId: string; from: number; to: number }
>("bookings:availability");
const createDraft = makeFunctionReference<
  "mutation",
  {
    bookingId?: string;
    trailerId: string;
    rentalType: "half" | "full";
    start: number;
    end: number;
    vehicleId: string;
    adjustableHitch: boolean;
  }
>("bookings:createDraft");

function toDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function range(draft: BookingDraft) {
  const start = toDate(draft.start).getTime();
  const end =
    draft.rentalType === "half"
      ? start + 5 * 60 * 60 * 1000
      : Math.max(toDate(draft.end).getTime(), start + MS_PER_DAY);
  return { start, end };
}

function quote(trailer: Trailer, draft: BookingDraft) {
  const days =
    draft.rentalType === "half"
      ? 1
      : Math.max(1, Math.ceil((range(draft).end - range(draft).start) / MS_PER_DAY));
  const dayRate =
    draft.rentalType === "half"
      ? trailer.rentalPrices.halfDay ?? trailer.rentalPrices.fullDay
      : trailer.rentalPrices.fullDay;
  let weekendDays = 0;
  for (let day = 0; day < days; day++) {
    const weekday = new Date(range(draft).start + day * MS_PER_DAY).getDay();
    if (weekday === 0 || weekday === 6) weekendDays++;
  }
  const base = days * dayRate;
  const weekendSurcharge = weekendDays * (trailer.weekendSurcharge ?? 0);
  const addOns = draft.adjustableHitch
    ? days * (ADJUSTABLE_HITCH_DAY_RATE_CENTS / 100)
    : 0;
  return { days, dayRate, base, weekendSurcharge, addOns, total: base + weekendSurcharge + addOns };
}

export function DatesStep({
  trailer,
  draft,
  onDraft,
  onContinue,
}: {
  trailer: Trailer;
  draft: BookingDraft;
  onDraft: (draft: BookingDraft) => void;
  onContinue: () => void;
}) {
  const saveDraft = useMutation(createDraft);
  const today = useMemo(() => new Date(), []);
  const [saving, setSaving] = useState(false);
  const windowStart = today.getTime();
  const windowEnd = windowStart + 90 * MS_PER_DAY;
  const booked = useQuery(availabilityQuery, {
    trailerId: trailer._id,
    from: windowStart,
    to: windowEnd,
  }) as [number, number][] | undefined;
  const selected = range(draft);
  const unavailable = Boolean(
    booked?.some(([start, end]) => selected.start < end && selected.end > start)
  );
  const pricing = quote(trailer, draft);

  const update = (next: Partial<BookingDraft>) => {
    const merged = { ...draft, ...next };
    if (merged.rentalType === "full" && merged.end <= merged.start) {
      merged.end = toInputDate(new Date(toDate(merged.start).getTime() + MS_PER_DAY));
    }
    onDraft(merged);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.vehicleId || unavailable) return;
    setSaving(true);
    try {
      const bookingId = (await saveDraft({
        bookingId: draft.bookingId,
        trailerId: trailer._id,
        rentalType: draft.rentalType,
        start: selected.start,
        end: selected.end,
        vehicleId: draft.vehicleId,
        adjustableHitch: draft.adjustableHitch,
      })) as string;
      onDraft({ ...draft, bookingId });
      onContinue();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        <Card>
          <p className="font-semibold text-ink">
            {formatLbs(trailer.weight.maxLoad)} max load.
          </p>
          <p className="mt-1 text-[14px] text-body-2">
            Concrete, dirt, or gravel hits that at about one-third full.
            Overage is {formatMoney(OVERAGE_PER_LB_CENTS / 100)}/lb.
          </p>
        </Card>

        <div>
          <span className="label-caps">Rental type</span>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {(["full", "half"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ rentalType: value })}
                className={classNames(
                  "border p-4 text-left",
                  draft.rentalType === value ? "border-ink bg-cream" : "border-rule-2"
                )}
              >
                <span className="display text-[26px] text-ink">
                  {value === "full" ? "Full day" : "Half day"}
                </span>
                <span className="block text-[14px] text-body-2">
                  {value === "full" ? "24 hours" : "5 hours from pickup"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label={draft.rentalType === "half" ? "Date" : "Start"}
            type="date"
            required
            min={toInputDate(today)}
            value={draft.start}
            onChange={(event) => update({ start: event.target.value })}
          />
          {draft.rentalType === "full" && (
            <Input
              label="Return"
              type="date"
              required
              min={draft.start}
              value={draft.end}
              onChange={(event) => update({ end: event.target.value })}
            />
          )}
        </div>

        {unavailable && (
          <p className="text-sm text-rust" role="alert">
            Those dates overlap an existing booking.
          </p>
        )}

        <Button
          type="submit"
          variant="amber"
          disabled={!draft.vehicleId || unavailable || saving}
          className="self-start"
        >
          {saving ? "Saving..." : "Continue"}
        </Button>
      </div>

      <Card variant="ink" header="Quote">
        <dl>
          {[
            [draft.rentalType === "half" ? "Half day" : `${pricing.days} full day${pricing.days > 1 ? "s" : ""}`, formatMoney(pricing.base)],
            ["Weekend", pricing.weekendSurcharge ? formatMoney(pricing.weekendSurcharge) : "--"],
            ...(pricing.addOns ? [["Adjustable hitch", formatMoney(pricing.addOns)]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3 border-b border-bone-3">
              <dt className="text-[15px] text-body-2">{label}</dt>
              <dd className="font-semibold text-[15px] text-ink">{value}</dd>
            </div>
          ))}
          <div className="flex justify-between items-baseline pt-4">
            <dt className="font-semibold text-[13px] uppercase tracking-[0.16em] text-ink">
              Total
            </dt>
            <dd className="font-display font-bold text-[36px] leading-none text-ink">
              {formatMoney(pricing.total)}
            </dd>
          </div>
        </dl>
      </Card>
    </form>
  );
}
