import * as React from "react";
import { SectionWrapper } from "~src/components";

type HowItWorksSectionProps = {};

export const HowItWorksSection = (props: HowItWorksSectionProps) => {
  return (
    <SectionWrapper>
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
              How it works
            </p>
          </div>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-5xl md:mx-auto">
            Renting a trailer is as easy as 1, 2, 3
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque rem aperiam, eaque ipsa quae.
          </p>
        </div>
        <div className="grid gap-8 row-gap-8 lg:grid-cols-3">
          <div className="sm:text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
              1
            </div>
            <h6 className="mb-2 font-semibold leading-5">Pick the Trailer</h6>
            <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
              Lookout flogging bilge rat main sheet bilge water nipper fluke to
              go on account heave down clap of thunder
            </p>
          </div>
          <div className="sm:text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
              2
            </div>
            <h6 className="mb-2 font-semibold leading-5">Book the Trailer</h6>
            <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
              They urge you to put down your sword and come join the winners. In
              22 years the only 'winners'
            </p>
          </div>
          <div className="sm:text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
              3
            </div>
            <h6 className="mb-2 font-semibold leading-5">Use the Trailer</h6>
            <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
              Tell them I hate them. Is the Space Pope reptilian!? Tell her she
              looks thin. Hello, little man
            </p>
          </div>
        </div>
    </SectionWrapper>
  );
};
