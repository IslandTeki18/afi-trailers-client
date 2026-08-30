import * as React from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Button, Input } from "~src/components";
import { classNames } from "~src/utils";
import { HitchReferencePhotos } from "../HitchReferencePhotos";
import { QualificationResult } from "./QualificationResult";
import type {
  QualificationFix,
  QualificationOutcome,
  VehicleQualificationInput,
} from "~convex/qualification";

const saveVehicle = makeFunctionReference<"mutation", VehicleQualificationInput>(
  "vehicles:save"
);

type Result = {
  vehicleId: string;
  outcome: QualificationOutcome;
  fixes: QualificationFix[];
  verifyAtHandoff: string[];
};

const initial: VehicleQualificationInput = {
  year: new Date().getFullYear(),
  make: "",
  model: "",
  ballSize: "2-5/16",
  connector: "7-blade",
  brakeController: "yes",
  receiver: "frame",
};

function RadioCard<T extends string>({
  name,
  value,
  current,
  title,
  body,
  onChange,
}: {
  name: string;
  value: T;
  current: T;
  title: string;
  body: string;
  onChange: (value: T) => void;
}) {
  const active = value === current;
  return (
    <label
      className={classNames(
        "border p-4 cursor-pointer",
        active ? "border-ink bg-cream" : "border-rule-2"
      )}
    >
      <input
        className="sr-only"
        type="radio"
        name={name}
        checked={active}
        onChange={() => onChange(value)}
      />
      <span className="display text-[24px] text-ink">{title}</span>
      <span className="mt-1 block text-[14px] leading-snug text-body-2">
        {body}
      </span>
    </label>
  );
}

export function VehicleStep({
  trailerId,
  adjustableHitch,
  onVehicleSaved,
  onContinue,
}: {
  trailerId: string;
  adjustableHitch: boolean;
  onVehicleSaved: (vehicleId: string, adjustableHitch: boolean) => void;
  onContinue: () => void;
}) {
  const save = useMutation(saveVehicle);
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const [hitch, setHitch] = useState(adjustableHitch);

  const update = <K extends keyof VehicleQualificationInput>(
    key: K,
    value: VehicleQualificationInput[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const next = (await save(form)) as Result;
      setResult(next);
      onVehicleSaved(next.vehicleId, hitch);
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <QualificationResult
        outcome={result.outcome}
        fixes={result.fixes}
        verifyAtHandoff={result.verifyAtHandoff}
        trailerId={trailerId}
        vehicleLabel={`${form.year} ${form.make} ${form.model}`}
        adjustableHitch={hitch}
        onToggleHitch={(value) => {
          setHitch(value);
          onVehicleSaved(result.vehicleId, value);
        }}
        onContinue={onContinue}
        onDifferentVehicle={() => setResult(null)}
      />
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          label="Year"
          type="number"
          required
          value={form.year}
          onChange={(event) => update("year", Number(event.target.value))}
        />
        <Input
          label="Make"
          required
          value={form.make}
          onChange={(event) => update("make", event.target.value)}
        />
        <Input
          label="Model"
          required
          value={form.model}
          onChange={(event) => update("model", event.target.value)}
        />
      </div>

      <div>
        <span className="label-caps">Ball size</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <RadioCard
            name="ballSize"
            value="2-5/16"
            current={form.ballSize}
            title='2-5/16"'
            body="Ready for this trailer."
            onChange={(value) => update("ballSize", value)}
          />
          <RadioCard
            name="ballSize"
            value="2"
            current={form.ballSize}
            title='2"'
            body="Requires our adjustable hitch or your own replacement ball."
            onChange={(value) => update("ballSize", value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <HitchReferencePhotos title='2-5/16" ball' body="Stamped on top of the ball." />
        <HitchReferencePhotos title="7-blade connector" body="Round trailer plug near the hitch." />
      </div>

      <div>
        <span className="label-caps">Connector</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <RadioCard
            name="connector"
            value="7-blade"
            current={form.connector}
            title="7-blade"
            body="Ready for trailer lights and brakes."
            onChange={(value) => update("connector", value)}
          />
          <RadioCard
            name="connector"
            value="4-pin"
            current={form.connector}
            title="4-pin"
            body="Needs a 4-to-7 adapter before pickup."
            onChange={(value) => update("connector", value)}
          />
        </div>
      </div>

      <div>
        <span className="label-caps">Brake controller</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          {(["yes", "no", "unsure"] as const).map((value) => (
            <RadioCard
              key={value}
              name="brakeController"
              value={value}
              current={form.brakeController}
              title={value === "unsure" ? "Not sure" : value}
              body={value === "yes" ? "Installed and working." : value === "no" ? "Blocks self service." : "We'll check this at pickup."}
              onChange={(next) => update("brakeController", next)}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="label-caps">Receiver</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <RadioCard name="receiver" value="frame" current={form.receiver} title="Frame" body="Mounted under the truck frame." onChange={(value) => update("receiver", value)} />
          <RadioCard name="receiver" value="bumper" current={form.receiver} title="Bumper" body="Blocks self service." onChange={(value) => update("receiver", value)} />
          <RadioCard name="receiver" value="unsure" current={form.receiver} title="Not sure" body="We'll check this at pickup." onChange={(value) => update("receiver", value)} />
        </div>
      </div>

      <Button type="submit" variant="amber" disabled={saving} className="self-start">
        {saving ? "Checking..." : "Check vehicle"}
      </Button>
    </form>
  );
}
