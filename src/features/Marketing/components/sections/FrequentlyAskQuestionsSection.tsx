import * as React from "react";
import { FAQItem } from "../FAQItem";
import { SectionWrapper, SectionHeading } from "~src/components";

type Item = { title: string; description: string };

type FrequentlyAskQuestionsSectionProps = {
  items: Item[];
  subHeader: string;
  description: string;
};

export const FrequentlyAskQuestionsSection = (
  props: FrequentlyAskQuestionsSectionProps
) => (
  <SectionWrapper className="bg-bone">
    <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <SectionHeading eyebrow="FAQ" title={props.subHeader} />
        <p className="-mt-4 text-base leading-relaxed text-body-2">
          {props.description}
        </p>
      </div>
      <div className="border-t-2 border-ink">
        {props.items.map((item) => (
          <FAQItem key={item.title} title={item.title}>
            {item.description}
          </FAQItem>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
