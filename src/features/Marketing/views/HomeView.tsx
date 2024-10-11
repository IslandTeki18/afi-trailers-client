import * as React from "react";
import {
  HeroImageSection,
  FeaturedTrailersSection,
  HowItWorksSection,
  AboutOurTeamSection,
  TrailerPricingSection,
  FrequentlyAskQuestionsSection,
} from "../components";
import { faqQuestions } from "../utils/homeFaq";

export const HomeView = () => {
  return (
    <div className="flex flex-col">
      <HeroImageSection />
      <FeaturedTrailersSection />
      <HowItWorksSection />
      <TrailerPricingSection />
      <AboutOurTeamSection />
      <FrequentlyAskQuestionsSection
        description="If you have any other questions, feel free to reach out to us. We
              would love to help you out."
        subHeader="Let's go over some common questions."
        items={faqQuestions}
      />
    </div>
  );
};
