import * as React from "react";
import { BookingDetailsSection } from "../components";
import mockDumpTrailer from "../utils/mockTrailer";

export const ConfirmationView = () => {
  return (
    <div className="flex flex-col">
      <BookingDetailsSection
        confirmationId="12345"
        customerName="John Doe"
        rentalPeriod={{ start: new Date(), end: new Date() }}
        totalPrice={100}
        shippingAddress={{
          street: "1234 Main St",
          suite: "Apt 123",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          country: "USA",
        }}
        trailer={mockDumpTrailer}
      />
    </div>
  );
};
