import * as React from "react";
import { FAQItem } from "../FAQItem";

export const FrequentlyAskQuestionsSection = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
        <div className="flex flex-col mb-16 sm:text-center">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
              Frequently Asked Questions
            </p>
          </div>
          <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              Let's go over some common questions
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              If you have any other questions, feel free to reach out to us. We
              would love to help you out.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <FAQItem title="What types of trailers do you offer for rent?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
          <FAQItem title="How do I book a trailer?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
          <FAQItem title="What are you rental rates and options?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
          <FAQItem title="Do I need a deposit to rent a trailer?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
          <FAQItem title="What is your cancellation policy?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
          <FAQItem title="What are the requirements for towing a trailer?">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </FAQItem>
        </div>
      </div>
    </div>
  );
};
