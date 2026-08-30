import * as React from "react";

export function HitchReferencePhotos({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="border border-rule-2 bg-bone-4 p-3 text-[13px] leading-snug text-body-2">
      <div className="mb-2 h-20 bg-sand flex items-center justify-center font-semibold uppercase tracking-[0.14em] text-mute">
        Reference
      </div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1">{body}</p>
    </div>
  );
}
