import * as React from "react";
import { Button } from "~src/components";

type ServiceSelectionViewProps = {
  onSelectServiceType: (serviceType: "FULL" | "SELF") => void;
};

export const ServiceSelectionView = (props: ServiceSelectionViewProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl">Select Service Type</h2>
      <div className="flex space-x-4">
        <Button
          onClick={() => props.onSelectServiceType("FULL")}
          variant="primary"
        >
          Full Service
        </Button>
        <Button
          onClick={() => props.onSelectServiceType("SELF")}
          variant="secondary"
        >
          Self Service
        </Button>
      </div>
    </div>
  );
};
