import * as React from "react";
import {
  HeroImageSection,
  FeaturedTrailersSection,
  HowItWorksSection,
  AboutOurTeamSection,
} from "../components";

export const HomeView = () => {
  return (
    <div className="flex flex-col">
      <HeroImageSection />
      <FeaturedTrailersSection />
      <HowItWorksSection />
      <AboutOurTeamSection />
    </div>
  );
};
