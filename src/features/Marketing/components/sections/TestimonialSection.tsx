import * as React from "react";
import { TestimonialCard, TestimonialCardProps } from "../TestimonialCard";
import { SectionWrapper, SectionHeading } from "~src/components";

export const TestimonialSection = ({
  testimonials,
}: {
  testimonials: TestimonialCardProps[];
}) => (
  <SectionWrapper className="bg-bone-2">
    <SectionHeading eyebrow="Testimonials" title="What customers say" rule />
    <div className="grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.name} {...testimonial} />
      ))}
    </div>
  </SectionWrapper>
);
