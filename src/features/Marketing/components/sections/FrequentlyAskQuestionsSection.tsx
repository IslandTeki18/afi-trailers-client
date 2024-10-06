import * as React from "react";
import { FAQItem } from "../FAQItem";

type FrequentlyAskQuestionsSectionProps = {
  items: Item[];
  subHeader: string;
  description: string;
};

type Item = {
  title: string;
  description: string;
};

export const FrequentlyAskQuestionsSection = (
  props: FrequentlyAskQuestionsSectionProps
) => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col mb-16 sm:text-center">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
              Frequently Asked Questions
            </p>
          </div>
          <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              {props.subHeader}
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              {props.description}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {props.items.map((item, index) => (
            <FAQItem key={index} title={item.title}>
              {item.description}
            </FAQItem>
          ))}
        </div>
      </div>
    </div>
  );
};
