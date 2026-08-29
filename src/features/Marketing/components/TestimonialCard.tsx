import { StarIcon } from "@heroicons/react/20/solid";
import * as React from "react";

export type TestimonialCardProps = {
  name: string;
  comment: string;
  rating: number;
};

export const TestimonialCard = (props: TestimonialCardProps) => (
  <div className="bg-paper border border-rule p-6 flex flex-col gap-4">
    <div className="flex" aria-label={`${props.rating} out of 5 stars`}>
      {[...Array(props.rating)].map((_, i) => (
        <StarIcon key={i} className="h-5 w-5 text-amber" />
      ))}
    </div>
    <p className="text-base leading-relaxed text-body">"{props.comment}"</p>
    <span className="font-display font-bold text-lg uppercase tracking-[0.06em] text-ink">
      {props.name}
    </span>
  </div>
);
