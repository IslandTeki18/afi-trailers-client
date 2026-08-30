import * as React from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Button, Input, Textarea } from "~src/components";

const setLoad = makeFunctionReference<
  "mutation",
  {
    bookingId: string;
    hauling: string;
    towDistanceMiles: number;
    dumpSite: string;
    adjustableHitch: boolean;
  }
>("bookings:setLoad");

export function LoadStep({
  bookingId,
  adjustableHitch,
  onContinue,
}: {
  bookingId: string;
  adjustableHitch: boolean;
  onContinue: () => void;
}) {
  const save = useMutation(setLoad);
  const [hauling, setHauling] = useState("");
  const [towDistanceMiles, setTowDistanceMiles] = useState("");
  const [dumpSite, setDumpSite] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await save({
        bookingId,
        hauling,
        towDistanceMiles: Number(towDistanceMiles),
        dumpSite,
        adjustableHitch,
      });
      onContinue();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Textarea
        label="What are you hauling?"
        rows={4}
        required
        value={hauling}
        onChange={(event) => setHauling(event.target.value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Tow distance miles"
          type="number"
          min="0"
          required
          value={towDistanceMiles}
          onChange={(event) => setTowDistanceMiles(event.target.value)}
        />
        <Input
          label="Dump site"
          required
          placeholder="e.g. Trans-Jordan Landfill, Bayview"
          value={dumpSite}
          onChange={(event) => setDumpSite(event.target.value)}
        />
      </div>
      <Button type="submit" variant="amber" disabled={saving} className="self-start">
        {saving ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
