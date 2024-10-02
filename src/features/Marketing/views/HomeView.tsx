import * as React from "react";
import {
  HeroImageSection,
  FeaturedTrailersSection,
  HowItWorksSection,
  AboutOurTeamSection,
  TrailerPricingSection,
  FrequentlyAskQuestionsSection,
} from "../components";

export const HomeView = () => {
  return (
    <div className="flex flex-col">
      <HeroImageSection />
      <FeaturedTrailersSection />
      <HowItWorksSection />
      <TrailerPricingSection />
      <AboutOurTeamSection />
      <FrequentlyAskQuestionsSection />
    </div>
  );
};
