import * as React from "react";
import { useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useParams } from "react-router-dom";
import { Badge, Button, Card, Input, Textarea } from "~src/components";
import {
  DEPOSIT_AMOUNT_CENTS,
  OVERAGE_PER_LB_CENTS,
  PHOTO_LABELS,
  REQUIRED_PICKUP_PHOTOS,
} from "~convex/rentalTerms";
import { formatMoney } from "~src/utils";
import { PhotoCapture, PhotoCompare } from "../components";

const getBooking = makeFunctionReference<"query", { bookingId: string }>(
  "bookings:getForOperator"
);
const listPhotos = makeFunctionReference<
  "query",
  { bookingId: string; phase: "pickup" | "return" }
>("photos:listForBooking");
const settleReturn = makeFunctionReference<
  "action",
  {
    bookingId: string;
    clean: boolean;
    damageAmount: number;
    overageLbs: number;
    notes?: string;
    photoIds: string[];
  }
>("stripe:settleReturn");

function paymentPath(total: number, booking: any) {
  const captureBefore = booking.stripe?.depositCaptureBefore ?? 0;
  const holdActive =
    booking.stripe?.depositStatus === "held" && Date.now() < captureBefore;
  if (total === 0) return "Release deposit hold";
  if (!holdActive) return "Hold expired; charge saved card or invoice";
  if (total <= DEPOSIT_AMOUNT_CENTS) return "Capture from deposit hold";
  return "Capture deposit and charge/invoice the remainder";
}

export function ReturnView() {
  const { bookingId } = useParams();
  const booking = useQuery(getBooking, bookingId ? { bookingId } : "skip") as any;
  const returnPhotos = (useQuery(
    listPhotos,
    bookingId ? { bookingId, phase: "return" } : "skip"
  ) ?? []) as any[];
  const settle = useAction(settleReturn);
  const [photoCount, setPhotoCount] = useState(0);
  const [clean, setClean] = useState(true);
  const [damageDollars, setDamageDollars] = useState("");
  const [overageLbs, setOverageLbs] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);

  const total = useMemo(() => {
    const damage = Math.round(Number(damageDollars || 0) * 100);
    const overage = Math.max(0, Number(overageLbs || 0)) * OVERAGE_PER_LB_CENTS;
    return damage + overage;
  }, [damageDollars, overageLbs]);

  if (!bookingId || booking === undefined) {
    return <p className="p-6 text-body-2">Loading return...</p>;
  }

  const selectedPhotoIds = returnPhotos
    .filter((photo) => selectedLabels.includes(photo.label))
    .map((photo) => photo._id);

  const finish = async () => {
    setSaving(true);
    try {
      setResult(
        await settle({
          bookingId,
          clean,
          damageAmount: clean ? 0 : Math.round(Number(damageDollars || 0) * 100),
          overageLbs: clean ? 0 : Number(overageLbs || 0),
          notes: notes || undefined,
          photoIds: selectedPhotoIds,
        })
      );
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-12">
        <Card header="Return complete">
          <p className="text-body-2">
            Deposit {result.depositStatus}; captured {formatMoney(result.capturedAmount / 100)};
            charged {formatMoney(result.chargedAmount / 100)}
            {result.invoiceUrl ? "; invoice sent" : ""}.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-12">
      <span className="eyebrow text-amber-dark">Return</span>
      <h1 className="display text-5xl text-ink">
        {booking.renter?.name || "Renter"}
      </h1>

      <div className="mt-8 flex flex-col gap-8">
        <Card header={`Return photos ${photoCount}/${REQUIRED_PICKUP_PHOTOS}`}>
          <PhotoCapture bookingId={bookingId} phase="return" onCount={setPhotoCount} />
        </Card>

        <Card header="Compare photos">
          <PhotoCompare bookingId={bookingId} />
        </Card>

        <Card header="Decision">
          <div className="flex gap-3">
            <Button variant={clean ? "amber" : "outline"} onClick={() => setClean(true)}>
              Clean return
            </Button>
            <Button variant={!clean ? "amber" : "outline"} onClick={() => setClean(false)}>
              Damage or overage
            </Button>
          </div>

          {!clean && (
            <div className="mt-5 flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Damage amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={damageDollars}
                  onChange={(event) => setDamageDollars(event.target.value)}
                />
                <Input
                  label="Overage lbs"
                  type="number"
                  min="0"
                  value={overageLbs}
                  onChange={(event) => setOverageLbs(event.target.value)}
                />
              </div>
              <Textarea
                label="Notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <div>
                <span className="label-caps">Reference photos</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PHOTO_LABELS.map((label) => (
                    <label key={label} className="flex items-center gap-2 border border-rule px-3 py-2 text-[13px]">
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label)}
                        onChange={(event) =>
                          setSelectedLabels(
                            event.target.checked
                              ? [...selectedLabels, label]
                              : selectedLabels.filter((item) => item !== label)
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <Badge variant="muted">
                {formatMoney(total / 100)}: {paymentPath(total, booking)}
              </Badge>
            </div>
          )}
        </Card>

        <Button
          variant="amber"
          disabled={photoCount < REQUIRED_PICKUP_PHOTOS || saving}
          onClick={finish}
        >
          {saving ? "Completing..." : "Complete return"}
        </Button>
      </div>
    </div>
  );
}
