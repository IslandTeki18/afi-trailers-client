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
          Hassle-Free Rentals in 3 Simple Steps
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Renting a dump trailer has never been easier. With our streamlined
          process, you can go from selecting your trailer to starting your
          project in no time. Whether you book online or over the phone, we make
          sure you're set up and ready to go with minimal effort. Choose, book,
          and get to work—it's that simple!
        </p>
      </div>
      <div className="grid gap-8 row-gap-8 lg:grid-cols-3">
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
            1
          </div>
          <h6 className="mb-2 font-semibold leading-5">Choose your Trailer</h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Browse our selection of dump trailers and pick the one that suits
            your project. We’ve got sizes for every job, big or small.
          </p>
        </div>
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
            2
          </div>
          <h6 className="mb-2 font-semibold leading-5">
            Book Online or Give us a Call
          </h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Reserve your trailer in just a few clicks. Select your rental
            period, choose your dates, and confirm your booking. Prefer to talk?
            Give us a call!
          </p>
        </div>
        <div className="sm:text-center">
          <div className="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-yellow-500 bg-yellow-50 sm:mx-auto">
            3
          </div>
          <h6 className="mb-2 font-semibold leading-5">Pick Up or Delivery</h6>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            Pick up your trailer at our location, or let us deliver it right to
            your site. Either way, you’re ready to start your project without
            delay!
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};
