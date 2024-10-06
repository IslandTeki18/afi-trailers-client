import * as React from "react";
import { TestimonialCard, TestimonialCardProps } from "../TestimonialCard";

type TestimonialSectionProps = {
  testimonials: TestimonialCardProps[];
};

export const TestimonialSection = (props: TestimonialSectionProps) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl sm:text-left mb-10">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
              testimonials
            </p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            What our customers say
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our team is made up of passionate individuals who are dedicated to
            providing the best trailer rental experience in Utah County.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
