export type VehicleQualificationInput = {
  year: number;
  make: string;
  model: string;
  ballSize: "2" | "2-5/16";
  connector: "4-pin" | "7-blade";
  brakeController: "yes" | "no" | "unsure";
  receiver: "frame" | "bumper" | "unsure";
};

export type QualificationFix = "adjustable_hitch" | "adapter_4_to_7";
export type QualificationOutcome =
  | "qualified"
  | "qualified_with_fix"
  | "not_qualified";

export function qualifyVehicle(input: VehicleQualificationInput): {
  outcome: QualificationOutcome;
  fixes: QualificationFix[];
  verifyAtHandoff: string[];
} {
  const fixes: QualificationFix[] = [];
  const verifyAtHandoff: string[] = [];

  if (input.ballSize === "2") fixes.push("adjustable_hitch");
  if (input.connector === "4-pin") fixes.push("adapter_4_to_7");
  if (input.brakeController === "unsure") {
    verifyAtHandoff.push("brakeController");
  }
  if (input.receiver === "unsure") verifyAtHandoff.push("receiver");

  const notQualified =
    input.receiver === "bumper" || input.brakeController === "no";

  return {
    outcome: notQualified
      ? "not_qualified"
      : fixes.length
        ? "qualified_with_fix"
        : "qualified",
    fixes,
    verifyAtHandoff,
  };
}

const FIX_DESCRIPTIONS: Record<
  QualificationFix,
  { title: string; body: string; addOn?: boolean }
> = {
  adjustable_hitch: {
    title: 'A 2-5/16" ball is required',
    body: 'Add our adjustable hitch or buy a 2-5/16" ball before pickup.',
    addOn: true,
  },
  adapter_4_to_7: {
    title: "A 7-blade connector is required",
    body: "Buy a 4-to-7 adapter before pickup. An adapter does not power electric brakes.",
  },
};

export const describeFix = (fix: QualificationFix) => FIX_DESCRIPTIONS[fix];
