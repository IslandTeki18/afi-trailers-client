import * as React from "react";
import { TrailerCard } from "../TrailerCard";
import { SectionWrapper } from "~src/components";

type FeaturedTrailersSectionProps = {};

export const FeaturedTrailersSection = (
  props: FeaturedTrailersSectionProps
) => {
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
          "Sed ut perspiciatis unde omnis iste natus error sit iste voluptatem
          accusantium doloremque rem aperiam, ipsa eaque quae. Sed ut
          perspiciatis unde omnis iste."
        </p>
      </div>
      <div className="grid gap-8 row-gap-5 mb-8 lg:grid-cols-3 lg:row-gap-8">
        <TrailerCard
          imageSrc="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
          title="7 x 14 Dump Trailer"
          description="This trailer is perfect for hauling dirt, gravel, and other materials. It has a 14,000 lb. payload capacity."
        />
        <TrailerCard
          imageSrc="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
          title="6 x 12 Utility Trailer"
          description="This trailer is perfect for hauling dirt, gravel, and other materials. It has a 14,000 lb. payload capacity."
        />
        <TrailerCard
          imageSrc="https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
          title="8 x 20 Equipment Trailer"
          description="This trailer is perfect for hauling dirt, gravel, and other materials. It has a 14,000 lb. payload capacity."
        />
      </div>
    </SectionWrapper>
  );
};
