import * as React from "react";
import { Link } from "react-router-dom";
import { Badge, buttonClasses } from "~src/components";
import { Trailer } from "~src/types";
import { trailerPath } from "~src/data/trailers";
import { formatMoney } from "~src/utils";

export const TrailerCard = ({ trailer }: { trailer: Trailer }) => {
  const { length, width, height } = trailer.dimensions;
  return (
    <div className="bg-paper border border-rule flex flex-col">
      <div className="relative h-[170px] bg-bone-3 overflow-hidden">
        {trailer.photos?.[0] && (
          <img
            src={trailer.photos[0]}
            alt={trailer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute left-0 top-0">
          <Badge>
            {trailer.availability.isAvailable ? "Available" : "On request"}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute-2">
          {length} ft · {width} ft wide · {height} ft walls
        </span>
        <span className="display text-[25px] text-ink">{trailer.name}</span>
        <p className="text-sm leading-normal text-body-2 flex-1">
          {trailer.description}
        </p>
        <div className="flex items-baseline gap-1.5 border-t border-bone-3 pt-3.5">
          <span className="font-display font-bold text-[30px] leading-none text-ink">
            {formatMoney(trailer.rentalPrices.fullDay)}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-mute-2">
            / day
          </span>
        </div>
        <Link
          to={trailerPath(trailer._id)}
          className={buttonClasses("primary", "small", "mt-1")}
        >
          View specs
        </Link>
      </div>
    </div>
  );
};
