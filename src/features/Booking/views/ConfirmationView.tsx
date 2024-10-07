import * as React from "react";
import { BookingDetailsSection } from "../components";
import mockDumpTrailer from "../utils/mockTrailer";

export const ConfirmationView = () => {
  return (
    <div className="flex flex-col">
      <BookingDetailsSection
        trailer={mockDumpTrailer}
        bookingDates={{ start: new Date(), end: new Date() }}
        totalPrice={100}
        user={{ name: "John Doe", email: "test@test.com" }}
      />
    </div>
  );
};
