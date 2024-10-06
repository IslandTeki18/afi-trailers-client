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
  const faqQuestions = [
    {
      title: "What types of trailers do you offer for rent?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
    {
      title: "How do I book a trailer?",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.",
    },
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
