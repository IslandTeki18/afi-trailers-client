import * as React from "react";
import { Button } from "~src/shared/ui";

type OrderPreviewViewProps = {
  address?: string;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  selectedDates: Date[];
  serviceType: string;
  onNextStep: () => void;
};

export const OrderPreviewView = (props: OrderPreviewViewProps) => {
  const totalDays = 2; /* Calculate total days */
  const depositDays = Math.ceil(totalDays / 3);
  const depositAmount = 200; /* Calculate deposit based on depositDays */
  
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Booking Preview</h3>
      <p>Dates: {props.selectedDates.join(", ")}</p>
      <p>
        Service Type:{" "}
        {props.serviceType === "full" ? "Full Service" : "Self Service"}
      </p>
      {props.serviceType === "full" && (
        <>
          <p>Delivery Address: {props.address}</p>
          <p>Name: {props.userInfo?.name || "N / A"}</p>
          <p>Email: {props.userInfo?.email || "N / A"}</p>
          <p>Phone: {props.userInfo?.phone || "N / A"}</p>
        </>
      )}
      <Button onClick={props.onNextStep}>
        {props.selectedDates.length > 3 ? "Pay Deposit" : "Book Now"}
      </Button>
    </div>
  );
};
