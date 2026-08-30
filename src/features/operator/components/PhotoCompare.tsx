import * as React from "react";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { PHOTO_LABELS } from "~convex/rentalTerms";

const listPhotos = makeFunctionReference<
  "query",
  { bookingId: string; phase: "pickup" | "return" }
>("photos:listForBooking");

export function PhotoCompare({ bookingId }: { bookingId: string }) {
  const pickup = (useQuery(listPhotos, { bookingId, phase: "pickup" }) ?? []) as any[];
  const returned = (useQuery(listPhotos, { bookingId, phase: "return" }) ?? []) as any[];

  return (
    <div className="grid gap-3">
      {PHOTO_LABELS.map((label) => {
        const left = pickup.find((photo) => photo.label === label);
        const right = returned.find((photo) => photo.label === label);
        return (
          <div key={label} className="grid grid-cols-2 gap-3 border border-rule p-3">
            {[left, right].map((photo, index) => (
              <div key={index}>
                <p className="mb-2 font-semibold uppercase tracking-[0.12em] text-[12px] text-ink">
                  {index === 0 ? "Pickup" : "Return"}: {label}
                </p>
                {photo?.url ? (
                  <img src={photo.url} alt="" className="h-28 w-full object-cover" />
                ) : (
                  <div className="h-28 bg-bone-4 flex items-center justify-center text-mute">
                    Missing
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
