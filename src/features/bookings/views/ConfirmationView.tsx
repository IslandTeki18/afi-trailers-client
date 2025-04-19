import * as React from "react";
import { BookingDetailsSection } from "../components";
import mockDumpTrailer from "../utils/mockTrailer";

export const ConfirmationView = () => {
  return (
    <div className="flex flex-col">
      {/* <BookingDetailsSection
        confirmationId="123456"
        customerName="John Doe"
        trailer={mockDumpTrailer}
        rentalPeriod={{
          start: new Date("2023-06-01"),
          end: new Date("2023-06-03"),
        }}
        totalPrice={250.0}
        serviceType="full"
        deliveryAddress={{
          street: "123 Main St",
          suite: "Apt 4B",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "USA",
        }}
      /> */}
      <BookingDetailsSection
        confirmationId="789012"
        customerName="Jane Smith"
        trailer={mockDumpTrailer}
        rentalPeriod={{
          start: new Date("2023-06-05"),
          end: new Date("2023-06-07"),
        }}
        totalPrice={200.0}
        serviceType="self"
        pickupLocation="456 Trailer Lot, Anytown, CA 12345"
      />
    </div>
  );
};
