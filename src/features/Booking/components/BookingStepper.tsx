import * as React from "react";
import { useState } from "react";
import { Stepper } from "~src/components";
import { bookingSteps } from "../utils/defaultLists";

export const BookingStepper = () => {
  const [steps, setSteps] = useState(bookingSteps);
  return (
    <div className="w-full">
      <Stepper steps={steps} variant="primary" />
    </div>
  );
};
