import * as React from "react";
import { Button } from "~src/components";
import { useNavigate } from "react-router-dom";

type TrailerCardProps = {
  imageSrc: string;
  title: string;
  trailerId?: string;
  description?: string;
};

export const TrailerCard = (props: TrailerCardProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <img
        className="object-cover w-full h-56 mb-6 rounded shadow-lg md:h-64 xl:h-80"
        src={props.imageSrc}
        alt={props.title}
      />
      <p className="mb-2 text-xl font-bold leading-none sm:text-2xl">
        {props.title}
      </p>
      <p className="text-gray-500 mb-3">{props.description}</p>
      <div className="flex item-center gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate(`/trailers/${props.trailerId}`)}
        >
          View Trailer
        </Button>
      </div>
    </div>
  );
};
