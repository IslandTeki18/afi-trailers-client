import * as React from "react";
import {
  TruckIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { FeatureCard, FeatureCardProps } from "../FeatureCard";
import { SectionWrapper } from "~src/shared/ui";

export const WhyRentWithUsSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <TruckIcon className="w-6 h-6 text-yellow-600" />,
      title: "Quality Equipment",
      description:
        "Our trailers are built to handle heavy-duty tasks and are regularly maintained to ensure top performance on every job.",
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />,
      title: "Flexible Rentals",
      description:
        "Rent by the day, week, or month—our flexible options let you choose the rental period that fits your project’s timeline.",
    },
    {
      icon: <StarIcon className="w-6 h-6 text-yellow-600" />,
      title: "Simple Booking",
      description:
        "We’ve streamlined the booking process so you can easily reserve your trailer online or with a quick phone call.",
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-yellow-600" />,
      title: "Exceptional Service",
      description:
        "From start to finish, we’re here to support your project with friendly, responsive customer service you can count on.",
    },
  ];

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl sm:text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Why choose us
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Our team is dedicated to providing the best trailer rental experience
          in Utah County. We offer a wide selection of trailers at competitive
          prices, with reliable equipment and 24/7 support to ensure your job
          gets done right.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </SectionWrapper>
  );
};
