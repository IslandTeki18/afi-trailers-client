import * as React from "react";
import {
  TruckIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { FeatureCard, FeatureCardProps } from "../FeatureCard";
import { SectionWrapper } from "~src/components";

export const WhyRentWithUsSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <TruckIcon className="w-6 h-6 text-yellow-600" />,
      title: "Wide Selection",
      description:
        "Choose from our diverse fleet of dump trailers, flatbeds, and more to suit your specific needs.",
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />,
      title: "Competitive Pricing",
      description:
        "Enjoy affordable rates without compromising on quality or service.",
    },
    {
      icon: <StarIcon className="w-6 h-6 text-yellow-600" />,
      title: "Reliable Equipment",
      description:
        "Our well-maintained trailers ensure your job gets done without unexpected breakdowns.",
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-yellow-600" />,
      title: "24/7 Support",
      description:
        "Our dedicated team is always available to assist you, ensuring a smooth rental experience.",
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
