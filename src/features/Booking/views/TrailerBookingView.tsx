import * as React from "react";
import { TrailerCalendar } from "../components";
import mockDumpTrailer from "../utils/mockTrailer";

export const TrailerBookingView = () => {
  return (
    <div className="flex flex-col p-4">
      <TrailerCalendar trailer={mockDumpTrailer} />
    </div>
  );
};
