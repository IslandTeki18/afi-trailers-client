import * as React from "react";
import { Header } from "~src/components";

export const TrailerDetailsView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="TrailerType"
        title="TrailerName"
        description="TrailerDescription"
      />
    </div>
  );
};
