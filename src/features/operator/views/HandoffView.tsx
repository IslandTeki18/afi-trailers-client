import * as React from "react";
import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Input } from "~src/components";
import {
  DEPOSIT_AMOUNT_CENTS,
  HANDOFF_CHECKLIST,
  REQUIRED_PICKUP_PHOTOS,
} from "~convex/rentalTerms";
import { formatMoney } from "~src/utils";
import { PhotoCapture } from "../components";

const getBooking = makeFunctionReference<"query", { bookingId: string }>(
  "bookings:getForOperator"
);
const placeHold = makeFunctionReference<"action", { bookingId: string }>(
  "stripe:placeDepositHold"
);
const sendInvoice = makeFunctionReference<
  "action",
  { bookingId: string; amount: number; reason: string }
>("stripe:sendInvoiceFallback");
const complete = makeFunctionReference<
  "mutation",
  {
    bookingId: string;
    checklist: Record<string, boolean>;
    verified: Record<string, string>;
    renterSignatureName: string;
    depositOverride?: boolean;
  }
>("handoff:completeHandoff");

export function HandoffView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = useQuery(getBooking, bookingId ? { bookingId } : "skip") as any;
  const hold = useAction(placeHold);
  const invoice = useAction(sendInvoice);
  const finish = useMutation(complete);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [verified, setVerified] = useState<Record<string, string>>({});
  const [photoCount, setPhotoCount] = useState(0);
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [depositOverride, setDepositOverride] = useState(false);
  const [holdMessage, setHoldMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!bookingId || booking === undefined) {
    return <p className="p-6 text-body-2">Loading handoff...</p>;
  }

  const depositHeld = booking.stripe?.depositStatus === "held" || holdMessage.startsWith("Held");
  const verifyItems = booking.vehicle?.verifyAtHandoff ?? [];
  const ready =
    HANDOFF_CHECKLIST.every((key) => checklist[key]) &&
    verifyItems.every((item: string) => verified[item]) &&
    photoCount >= REQUIRED_PICKUP_PHOTOS &&
    signature.trim() &&
    agreed &&
    (depositHeld || depositOverride);

  const finishHandoff = async () => {
    if (!ready) return;
    setSaving(true);
    try {
      await finish({
        bookingId,
        checklist,
        verified,
        renterSignatureName: signature,
        depositOverride,
      });
      navigate("/operator");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-12">
      <span className="eyebrow text-amber-dark">Handoff</span>
      <h1 className="display text-5xl text-ink">
        {booking.renter?.name || "Renter"}
      </h1>

      <div className="mt-8 flex flex-col gap-8">
        <Card header="Verify">
          <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
            {booking.renter?.licenseUrl ? (
              <img src={booking.renter.licenseUrl} alt="" className="w-full border border-rule" />
            ) : (
              <div className="bg-bone-4 border border-rule min-h-28 flex items-center justify-center text-mute">
                No license photo
              </div>
            )}
            <div className="flex flex-col gap-3">
              {HANDOFF_CHECKLIST.map((item) => (
                <label key={item} className="flex items-center gap-3 text-body">
                  <input
                    type="checkbox"
                    checked={Boolean(checklist[item])}
                    onChange={(event) =>
                      setChecklist({ ...checklist, [item]: event.target.checked })
                    }
                  />
                  {item.replace(/_/g, " ")}
                </label>
              ))}
              {verifyItems.map((item: string) => (
                <Input
                  key={item}
                  label={`Confirm ${item}`}
                  required
                  value={verified[item] ?? ""}
                  onChange={(event) =>
                    setVerified({ ...verified, [item]: event.target.value })
                  }
                />
              ))}
            </div>
          </div>
        </Card>

        <Card header={`Photos ${photoCount}/${REQUIRED_PICKUP_PHOTOS}`}>
          <PhotoCapture bookingId={bookingId} phase="pickup" onCount={setPhotoCount} />
        </Card>

        <Card header="Condition report">
          <p className="mb-4 text-body-2">
            Anything not shown here is attributed to you at return.
          </p>
          <Input
            label="Renter typed name"
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
          />
          <label className="mt-4 flex items-center gap-3 text-body">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            Renter accepts this pickup condition report.
          </label>
        </Card>

        <Card header="Deposit hold">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="amber"
              onClick={async () => {
                const result = (await hold({ bookingId })) as any;
                setHoldMessage(
                  result.ok
                    ? `Held until ${result.captureBefore ? new Date(result.captureBefore).toLocaleDateString() : "card network release"}`
                    : result.reason
                );
              }}
            >
              Place {formatMoney(DEPOSIT_AMOUNT_CENTS / 100)} hold
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                void invoice({
                  bookingId,
                  amount: DEPOSIT_AMOUNT_CENTS,
                  reason: "Security deposit hold failed",
                })
              }
            >
              Send invoice link
            </Button>
            <Button variant="outline" onClick={() => setDepositOverride(true)}>
              Override
            </Button>
          </div>
          {(holdMessage || depositOverride) && (
            <div className="mt-4">
              <Badge variant={depositHeld ? "amber" : "muted"}>
                {depositOverride ? "Override recorded" : holdMessage}
              </Badge>
            </div>
          )}
        </Card>

        <Button variant="amber" disabled={!ready || saving} onClick={finishHandoff}>
          {saving ? "Completing..." : "Complete handoff"}
        </Button>
      </div>
    </div>
  );
}
