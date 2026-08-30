import * as React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonLink, Card } from "~src/components";
import { bookingPath } from "~src/data/trailers";
import { ADJUSTABLE_HITCH_DAY_RATE_CENTS } from "~convex/rentalTerms";
import { describeFix, type QualificationFix, type QualificationOutcome } from "~convex/qualification";
import { formatMoney } from "~src/utils";

export function QualificationResult({
  outcome,
  fixes,
  verifyAtHandoff,
  trailerId,
  vehicleLabel,
  adjustableHitch,
  onToggleHitch,
  onContinue,
  onDifferentVehicle,
}: {
  outcome: QualificationOutcome;
  fixes: QualificationFix[];
  verifyAtHandoff: string[];
  trailerId: string;
  vehicleLabel: string;
  adjustableHitch: boolean;
  onToggleHitch: (value: boolean) => void;
  onContinue: () => void;
  onDifferentVehicle: () => void;
}) {
  if (outcome === "not_qualified") {
    return (
      <Card>
        <h3 className="display text-[30px] text-ink">Full service is the safer fit</h3>
        <p className="mt-2 text-body-2">
          Your {vehicleLabel} can't safely tow this trailer. Full Service brings
          it to you, no truck needed.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink to={`${bookingPath(trailerId)}?service=full`} variant="amber">
            Request full service
          </ButtonLink>
          <Button variant="outline" onClick={onDifferentVehicle}>
            Use a different vehicle
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="display text-[30px] text-ink">
        {outcome === "qualified" ? "Vehicle qualified" : "Vehicle qualified with fixes"}
      </h3>
      <p className="mt-2 text-body-2">{vehicleLabel} can continue for self service.</p>

      {fixes.length > 0 && (
        <div className="mt-5 flex flex-col gap-3">
          {fixes.map((fix) => {
            const description = describeFix(fix);
            return (
              <div key={fix} className="border border-rule-2 p-4">
                <p className="font-semibold text-ink">{description.title}</p>
                <p className="mt-1 text-[14px] text-body-2">{description.body}</p>
                {description.addOn && (
                  <label className="mt-3 flex items-center gap-3 text-[14px] text-body">
                    <input
                      type="checkbox"
                      checked={adjustableHitch}
                      onChange={(event) => onToggleHitch(event.target.checked)}
                    />
                    Add adjustable hitch,{" "}
                    {formatMoney(ADJUSTABLE_HITCH_DAY_RATE_CENTS / 100)}/day
                  </label>
                )}
              </div>
            );
          })}
        </div>
      )}

      {verifyAtHandoff.length > 0 && (
        <p className="mt-4 text-[13px] text-mute">
          We'll check {verifyAtHandoff.join(" and ")} at pickup.
        </p>
      )}

      <Button className="mt-5" variant="amber" onClick={onContinue}>
        Continue
      </Button>
      <Link to="#" onClick={onDifferentVehicle} className="ml-4 nav-link text-ink border-b-2 border-amber">
        Use a different vehicle
      </Link>
    </Card>
  );
}
