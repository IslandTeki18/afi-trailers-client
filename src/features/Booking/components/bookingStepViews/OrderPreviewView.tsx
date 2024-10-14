import * as React from "react";
import { useState } from "react";

type OrderPreviewViewProps = {
  selectedDates: Date[];
  serviceType: string;
};

export const OrderPreviewView = (props: OrderPreviewViewProps) => {
  const totalDays = 2; /* Calculate total days */
  const depositDays = Math.ceil(totalDays / 3);
  const depositAmount = 200; /* Calculate deposit based on depositDays */
  return (
    <div>
      <h2>Order Preview</h2>
      <p>Selected Dates: {props.selectedDates.toString()}</p>
      <p>Service Type: {props.serviceType}</p>
      <p>Total Days: {totalDays}</p>
      {totalDays > 1 && <p>Deposit Required: ${depositAmount}</p>}
      <button className="btn-primary">Book Now</button>
    </div>
  );
};
