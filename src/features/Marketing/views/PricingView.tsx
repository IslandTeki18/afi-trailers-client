import * as React from "react";
import { Header } from "~src/components";
import {
  TrailerPricingSection,
  TrailerPricingTableSection,
  AdditionalFeesSection,
  DiscountsPromotionsSection,
  FrequentlyAskQuestionsSection,
} from "../components";

export const PricingView = () => {
  const faqQuestions = [
    {
      title: "What are you rental rates and options?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
    {
      title: "Do I need a deposit to rent a trailer?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
    {
      title: "What is your cancellation policy?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
    {
      title: "What are the requirements for towing a trailer?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
  ];
  return (
    <div className="flex flex-col">
      <Header
        subTitle="Our Pricing"
        title="Our Affordable Pricing"
        description="Find a pricing plan that best fits your project needs."
      />
      <TrailerPricingSection />
      <TrailerPricingTableSection />
      <AdditionalFeesSection />
      <DiscountsPromotionsSection />
      <FrequentlyAskQuestionsSection
        description="If you have any other questions, feel free to reach out to us. We would love to help you out."
        subHeader="Let's go over some common pricing questions"
        items={faqQuestions}
      />
    </div>
  );
};
