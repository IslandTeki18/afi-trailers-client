import * as React from "react";
import { Header } from "~src/shared/ui";
import {
  TrailerPricingSection,
  TrailerPricingTableSection,
  AdditionalFeesSection,
  DiscountsPromotionsSection,
  FrequentlyAskQuestionsSection,
  HowItWorksSection,
} from "../components";
import { faqQuestions } from "../utils/pricingFaq";

export const PricingView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="Our Pricing"
        title="Our Affordable Pricing"
        description="Find a pricing plan that best fits your project needs."
      />
      <TrailerPricingSection />
      {/* <TrailerPricingTableSection /> */}
      <HowItWorksSection />
      <FrequentlyAskQuestionsSection
        description="If you have any other questions, feel free to reach out to us. We would love to help you out."
        subHeader="Let's go over some common pricing questions"
        items={faqQuestions}
      />
    </div>
  );
};
