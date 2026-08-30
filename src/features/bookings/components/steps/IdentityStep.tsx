import * as React from "react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Button, Input } from "~src/components";
import { MIN_RENTER_AGE } from "~convex/rentalTerms";

const uploadUrl = makeFunctionReference<"mutation", Record<string, never>>(
  "renters:generateLicenseUploadUrl"
);
const upsertProfile = makeFunctionReference<
  "mutation",
  {
    name: string;
    phone: string;
    dob: string;
    licenseNumber: string;
    licenseStorageId: string;
  }
>("renters:upsertProfile");

export function IdentityStep({
  renter,
  onContinue,
}: {
  renter: any;
  onContinue: () => void;
}) {
  const getUploadUrl = useMutation(uploadUrl);
  const saveProfile = useMutation(upsertProfile);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseStorageId, setLicenseStorageId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!renter) return;
    setName((value) => value || renter.name || "");
    setPhone((value) => value || renter.phone || "");
    setDob((value) => value || renter.dob || "");
    setLicenseNumber((value) => value || renter.licenseNumber || "");
    setLicenseStorageId((value) => value || renter.licenseStorageId || "");
  }, [renter]);

  const uploadLicense = async (file: File) => {
    const url = (await getUploadUrl({})) as string;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) throw new Error("LICENSE_UPLOAD_FAILED");
    const body = (await response.json()) as { storageId: string };
    setLicenseStorageId(body.storageId);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveProfile({ name, phone, dob, licenseNumber, licenseStorageId });
      onContinue();
    } catch (nextError) {
      const message = String(nextError);
      setError(
        message.includes("UNDERAGE")
          ? `Renters must be ${MIN_RENTER_AGE}+ under our insurance program.`
          : "Profile could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full legal name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Mobile"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Date of birth"
          type="date"
          required
          value={dob}
          onChange={(event) => setDob(event.target.value)}
        />
        <Input
          label="License number"
          required
          value={licenseNumber}
          onChange={(event) => setLicenseNumber(event.target.value)}
        />
      </div>
      <Input
        label="License photo"
        type="file"
        accept="image/*"
        capture="environment"
        required={!licenseStorageId}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadLicense(file).catch(() => setError("License photo could not be uploaded."));
        }}
      />
      {licenseStorageId && (
        <p className="text-[13px] text-mute">License photo uploaded.</p>
      )}
      {error && (
        <p className="text-sm text-rust" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="amber"
        disabled={!licenseStorageId || saving}
        className="self-start"
      >
        {saving ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
