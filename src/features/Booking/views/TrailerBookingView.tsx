import * as React from "react";
import { TrailerCalendar } from "../components";
import { dumpTrailer } from "../../../data/dumpTrailer";

export const TrailerBookingView = () => {
  return (
    <div className="flex flex-col p-4">
      <TrailerCalendar trailer={dumpTrailer} />
    </div>
  );
};
