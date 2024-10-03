import * as React from "react";
import { Header } from "~src/components";
import { TrailerPricingSection } from "../components";

export const PricingView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="Our Pricing"
        title="Our Affordable Pricing"
        description="Find a pricing plan that best fits your project needs."
      />
      <TrailerPricingSection />
    </div>
  );
};
