import * as React from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Badge } from "~src/components";
import { PHOTO_LABELS } from "~convex/rentalTerms";

const uploadUrl = makeFunctionReference<"mutation", Record<string, never>>(
  "photos:generateUploadUrl"
);
const attachPhoto = makeFunctionReference<
  "mutation",
  {
    bookingId: string;
    phase: "pickup" | "return";
    storageId: string;
    label: string;
    lat?: number;
    lng?: number;
    accuracy?: number;
  }
>("photos:attach");
const listPhotos = makeFunctionReference<
  "query",
  { bookingId: string; phase: "pickup" | "return" }
>("photos:listForBooking");

function position(): Promise<GeolocationCoordinates | null> {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (result) => resolve(result.coords),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

export function PhotoCapture({
  bookingId,
  phase,
  onCount,
}: {
  bookingId: string;
  phase: "pickup" | "return";
  onCount?: (count: number) => void;
}) {
  const getUploadUrl = useMutation(uploadUrl);
  const attach = useMutation(attachPhoto);
  const photos = (useQuery(listPhotos, { bookingId, phase }) ?? []) as any[];
  const [warning, setWarning] = useState("");
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    onCount?.(photos.length);
  }, [onCount, photos.length]);

  const upload = async (label: string, file: File) => {
    setUploading(label);
    setWarning("");
    try {
      const coords = await position();
      if (!coords) setWarning("Location unavailable; photo saved without GPS.");
      const url = (await getUploadUrl({})) as string;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("PHOTO_UPLOAD_FAILED");
      const { storageId } = (await response.json()) as { storageId: string };
      await attach({
        bookingId,
        phase,
        storageId,
        label,
        lat: coords?.latitude,
        lng: coords?.longitude,
        accuracy: coords?.accuracy,
      });
    } finally {
      setUploading("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {warning && <Badge variant="muted">{warning}</Badge>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PHOTO_LABELS.map((label) => {
          const photo = photos.find((item) => item.label === label);
          return (
            <label key={label} className="border border-rule-2 bg-paper p-3 min-h-[150px] flex flex-col gap-2 cursor-pointer">
              <span className="font-semibold text-[13px] uppercase tracking-[0.12em] text-ink">
                {label}
              </span>
              {photo?.url ? (
                <img src={photo.url} alt="" className="h-24 w-full object-cover" />
              ) : (
                <span className="h-24 w-full bg-bone-4 flex items-center justify-center text-[13px] text-mute">
                  {uploading === label ? "Uploading..." : "Tap to add"}
                </span>
              )}
              {photo && <Badge variant="amber">Saved</Badge>}
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(label, file).catch(console.error);
                }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
