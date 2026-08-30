import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useParams, useSearchParams } from "react-router-dom";
import { Badge, Button, Card } from "~src/components";
import { findTrailer } from "~src/data/trailers";
import { TrailerNotFound } from "~src/features/Trailers/components";
import { classNames } from "~src/utils";
import {
  AgreementStep,
  DatesStep,
  IdentityStep,
  LoadStep,
  StepCard,
  VehicleStep,
} from "../components";
import {
  type BookingDraft,
  defaultDraft,
  loadDraft,
  saveDraft,
} from "../utils/bookingDraft";
import { useBooking } from "~src/hooks/useBooking";

const meQuery = makeFunctionReference<"query", Record<string, never>>(
  "renters:me"
);
const vehiclesQuery = makeFunctionReference<"query", Record<string, never>>(
  "vehicles:listMine"
);

const steps = [
  "vehicle",
  "dates",
  "load",
  "identity",
  "agreement",
  "payment",
] as const;
type Step = (typeof steps)[number];

function isStep(value: string | null): value is Step {
  return steps.includes(value as Step);
}

function profileComplete(renter: any) {
  return Boolean(
    renter?.name &&
      renter?.phone &&
      renter?.dob &&
      renter?.licenseNumber &&
      renter?.licenseStorageId
  );
}

export const SelfServiceBookingView = () => {
  const { trailerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const trailer = findTrailer(trailerId);
  const [draft, setDraft] = useState<BookingDraft>(() =>
    typeof window === "undefined" ? defaultDraft() : loadDraft()
  );
  const [returning, setReturning] = useState(false);
  const [returnPrompt, setReturnPrompt] = useState(true);
  const [loadSaved, setLoadSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const renter = useQuery(meQuery, {});
  const vehicles = useQuery(vehiclesQuery, {});
  const booking = useBooking(draft.bookingId);
  const firstVehicle = Array.isArray(vehicles) ? vehicles[0] : null;
  const stepParam = searchParams.get("step");
  const requestedStep: Step = isStep(stepParam) ? stepParam : "vehicle";

  if (!trailer) return <TrailerNotFound />;

  const updateDraft = (next: BookingDraft) => {
    setDraft(next);
    saveDraft(next);
  };

  const go = (step: Step) => setSearchParams({ step });

  const canReach = (step: Step) => {
    if (step === "vehicle") return true;
    if (!draft.vehicleId) return false;
    if (step === "dates") return true;
    if (!draft.bookingId) return false;
    if (!booking) return true;
    if (step === "load") return booking.status === "qualified";
    if (step === "identity") return Boolean(booking.load) || loadSaved;
    if (step === "agreement") {
      return (
        (Boolean(booking.load) || loadSaved) &&
        (returning || profileSaved || profileComplete(renter))
      );
    }
    return booking.status === "signed" || agreementSigned;
  };

  const currentStep = canReach(requestedStep) ? requestedStep : "vehicle";

  useEffect(() => {
    if (requestedStep !== currentStep) go(currentStep);
  }, [requestedStep, currentStep]);

  const visibleSteps = useMemo(
    () => steps.filter((step) => !(returning && step === "identity")),
    [returning]
  );

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 pt-11 pb-24">
      <div className="flex flex-col gap-3 mb-9">
        <span className="eyebrow text-amber-dark">Self service</span>
        <h1 className="display text-5xl sm:text-[66px] leading-[0.94] text-ink">
          Book {trailer.shortName}
        </h1>
      </div>

      <div className="grid gap-11 lg:grid-cols-[260px_1fr] items-start">
        <Card className="lg:sticky lg:top-6">
          <ol className="flex flex-col gap-2">
            {visibleSteps.map((step, index) => (
              <li key={step}>
                <button
                  type="button"
                  disabled={!canReach(step)}
                  onClick={() => go(step)}
                  className={classNames(
                    "w-full flex items-center gap-3 py-2 text-left text-[13px] font-semibold uppercase tracking-[0.14em]",
                    currentStep === step ? "text-ink" : "text-mute",
                    canReach(step) && "hover:text-amber-dark"
                  )}
                >
                  <span className="w-6 h-6 bg-ink text-bone text-center leading-6">
                    {index + 1}
                  </span>
                  {step}
                </button>
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex flex-col gap-6">
          {returnPrompt && firstVehicle && profileComplete(renter) && (
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge>Tow vehicle</Badge>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    Towing with your {firstVehicle.year} {firstVehicle.make}{" "}
                    {firstVehicle.model} again?
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="amber"
                    onClick={() => {
                      updateDraft({ ...draft, vehicleId: firstVehicle._id });
                      setReturning(true);
                      setReturnPrompt(false);
                      go("dates");
                    }}
                  >
                    Yes, skip
                  </Button>
                  <Button variant="outline" onClick={() => setReturnPrompt(false)}>
                    Different vehicle
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <StepCard n={visibleSteps.indexOf(currentStep) + 1} title={currentStep}>
            {currentStep === "vehicle" ? (
              <VehicleStep
                trailerId={trailer._id}
                adjustableHitch={draft.adjustableHitch}
                onVehicleSaved={(vehicleId, adjustableHitch) =>
                  updateDraft({ ...draft, vehicleId, adjustableHitch })
                }
                onContinue={() => go("dates")}
              />
            ) : currentStep === "dates" ? (
              <DatesStep
                trailer={trailer}
                draft={draft}
                onDraft={updateDraft}
                onContinue={() => go("load")}
              />
            ) : currentStep === "load" && draft.bookingId ? (
              <LoadStep
                bookingId={draft.bookingId}
                adjustableHitch={draft.adjustableHitch}
                onContinue={() => {
                  setLoadSaved(true);
                  go(returning ? "agreement" : "identity");
                }}
              />
            ) : currentStep === "identity" ? (
              <IdentityStep
                renter={renter}
                onContinue={() => {
                  setProfileSaved(true);
                  go("agreement");
                }}
              />
            ) : currentStep === "agreement" && draft.bookingId ? (
              <AgreementStep
                bookingId={draft.bookingId}
                renterName={renter?.name ?? ""}
                returning={returning}
                onContinue={() => {
                  setAgreementSigned(true);
                  go("payment");
                }}
              />
            ) : (
              <p className="text-body-2">
                {currentStep === "payment" &&
                  "Payment collection comes next in this flow."}
              </p>
            )}
          </StepCard>
        </div>
      </div>
    </div>
  );
};
