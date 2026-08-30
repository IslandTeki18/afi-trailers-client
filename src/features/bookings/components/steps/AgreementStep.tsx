import * as React from "react";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Button, Input } from "~src/components";
import { ContractView } from "~src/features/Trailers/components/ContractView";
import { contractSelfServiceSections } from "~src/features/Trailers/utils/driveOffContractSections";
import {
  AGREEMENT_INITIALS,
  LOAD_SPECIFIC_INITIAL_KEYS,
} from "~convex/rentalTerms";

const returningStatusQuery = makeFunctionReference<
  "query",
  { bookingId: string },
  boolean
>("agreement:returningStatus");

export function AgreementStep({
  bookingId,
  renterName,
  onContinue,
}: {
  bookingId: string;
  renterName: string;
  onContinue: () => void;
}) {
  const { getToken } = useAuth();
  // Server decides who signs the short form; until it answers, show the full form.
  const returning = useQuery(returningStatusQuery, { bookingId }) === true;
  const [initials, setInitials] = useState<Record<string, string>>({});
  const [signatureName, setSignatureName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const requiredItems = useMemo(
    () =>
      AGREEMENT_INITIALS.filter((item) =>
        returning
          ? LOAD_SPECIFIC_INITIAL_KEYS.some((key) => key === item.key)
          : true
      ),
    [returning]
  );
  const initialsComplete = requiredItems.every((item) =>
    /^[A-Z]{2,3}$/.test(initials[item.key] ?? "")
  );
  const signatureMatches =
    signatureName.trim().toLowerCase() === renterName.trim().toLowerCase();
  const disabled = !initialsComplete || !signatureMatches || !agreed || saving;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    setSaving(true);
    setError("");
    try {
      const token = await getToken({ template: "convex" });
      const response = await fetch(`${process.env.CONVEX_SITE_URL}/agreement/sign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, signatureName, initials }),
      });
      if (!response.ok) throw new Error(await response.text());
      onContinue();
    } catch (nextError) {
      console.error(nextError);
      setError("Agreement could not be signed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="-mx-6 -mt-6">
        <ContractView
          eyebrow="Self service"
          title="Drive-off contract"
          description="Review the rental agreement before payment."
          sections={contractSelfServiceSections}
        />
      </div>

      <div className="flex flex-col gap-4">
        {requiredItems.map((item) => (
          <div key={item.key} className="grid gap-3 sm:grid-cols-[1fr_110px] sm:items-center border-t border-rule pt-4">
            <p className="text-[15px] leading-relaxed text-body-2">{item.text}</p>
            <Input
              maxLength={3}
              placeholder="LM"
              value={initials[item.key] ?? ""}
              onChange={(event) =>
                setInitials({
                  ...initials,
                  [item.key]: event.target.value.toUpperCase(),
                })
              }
            />
          </div>
        ))}
      </div>

      <Input
        label="Type your full legal name"
        required
        value={signatureName}
        onChange={(event) => setSignatureName(event.target.value)}
      />
      {signatureName && !signatureMatches && (
        <p className="text-sm text-rust">Typed name must match {renterName}.</p>
      )}

      <label className="flex gap-3 items-start text-[15px] leading-snug text-body cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] rounded-none border-2 border-ink text-ink focus:ring-amber"
        />
        <span>I agree this typed name is my electronic signature.</span>
      </label>

      {error && (
        <p className="text-sm text-rust" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="amber" disabled={disabled} className="self-start">
        {saving ? "Signing..." : "Continue to payment"}
      </Button>
    </form>
  );
}
