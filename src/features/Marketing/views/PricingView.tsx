import * as React from "react";
import { Header, SectionWrapper, SectionHeading } from "~src/components";
import {
  ServicesSection,
  PostedRatesTable,
  AdditionalFeesSection,
  FrequentlyAskQuestionsSection,
  HowItWorksSection,
} from "../components";
import { faqQuestions } from "../utils/pricingFaq";
import { trailers } from "~src/data/trailers";

export const PricingView = () => (
  <>
    <Header
      subTitle="Our pricing"
      title="Every rate, on the front page"
      description="Half day or full day, self service or full service. No security deposit, no cleaning fee, no surprises at the hitch."
      tone="light"
      aside={<PostedRatesTable trailer={trailers[0]} />}
    />
    <ServicesSection />
    <SectionWrapper className="bg-bone">
      <SectionHeading eyebrow="Additional fees" title="If the rules are broken" />
      <div className="max-w-3xl">
        <AdditionalFeesSection />
      </div>
    </SectionWrapper>
    <HowItWorksSection />
    <FrequentlyAskQuestionsSection
      description="If you have any other questions, feel free to reach out. We would love to help."
      subHeader="Common pricing questions"
      items={faqQuestions}
    />
  </>
);
