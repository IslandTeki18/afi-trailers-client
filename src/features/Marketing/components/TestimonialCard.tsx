import { StarIcon } from "@heroicons/react/20/solid";
import * as React from "react";

export type TestimonialCardProps = {
  name: string;
  comment: string;
  rating: number;
};

export const TestimonialCard = (props: TestimonialCardProps) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
    <h3 className="font-bold text-lg mb-2">{props.name}</h3>
    <p className="text-gray-700 mb-4">{props.comment}</p>
    <div className="flex">
      {[...Array(props.rating)].map((_, i) => (
        <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
      ))}
    </div>
  </div>
);
