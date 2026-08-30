import * as React from "react";
import { useParams } from "react-router-dom";
import { findTrailer } from "~src/data/trailers";
import { TrailerNotFound } from "~src/features/Trailers/components";

export const SelfServiceBookingView = () => {
  const { trailerId } = useParams();
  const trailer = findTrailer(trailerId);

  if (!trailer) return <TrailerNotFound />;

  return (
    <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-20">
      <span className="eyebrow text-amber-dark">Self service</span>
      <h1 className="display text-5xl sm:text-[66px] leading-[0.94] text-ink">
        Book {trailer.shortName}
      </h1>
    </div>
  );
};
