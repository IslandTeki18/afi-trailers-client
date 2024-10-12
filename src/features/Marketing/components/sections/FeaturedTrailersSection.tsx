import * as React from "react";
import { TrailerCard } from "../TrailerCard";
import { SectionWrapper } from "~src/components";
// @ts-ignore
import dumpTrailer from "../../assets/7x14Dump_Trailer.jpg";

export const FeaturedTrailersSection = () => {
  return (
    <SectionWrapper>
      <div className="flex flex-col w-full mb-6 lg:justify-between lg:flex-row md:mb-8">
        <div className="flex items-center mb-5 md:mb-6 group lg:max-w-xl">
          <h2 className="font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl">
            <span className="inline-block mb-2">Featured Trailers</span>
            <div className="h-1 ml-auto duration-300 origin-left transform bg-yellow-400 scale-x-30 group-hover:scale-x-100" />
          </h2>
        </div>
        <p className="w-full text-gray-700 lg:text-sm lg:max-w-md">
          Each trailer is available for daily, weekly, or monthly rentals—choose
          the one that fits your needs and get to work!
        </p>
      </div>
      <div className="grid gap-8 row-gap-5 mb-8 lg:grid-cols-3 lg:row-gap-8">
        <TrailerCard
          imageSrc={dumpTrailer}
          title="7 x 14 Dump Trailer with 4ft walls"
          description="This trailer is perfect for hauling junk, dirt, gravel, and other materials. It has a 14,000 lb. payload capacity."
          trailerId="st7x14x4dump001"
        />
      </div>
    </SectionWrapper>
  );
};
