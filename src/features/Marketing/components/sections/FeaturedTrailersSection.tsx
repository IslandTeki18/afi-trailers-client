import * as React from "react";
import { Link } from "react-router-dom";
import { TrailerCard } from "../TrailerCard";
import { SectionWrapper, SectionHeading } from "~src/components";
import { trailers } from "~src/data/trailers";

export const FeaturedTrailersSection = ({
  showAllLink = true,
}: {
  showAllLink?: boolean;
}) => (
  <SectionWrapper className="bg-bone">
    <SectionHeading
      eyebrow="The fleet"
      title={
        trailers.length === 1
          ? "One trailer, one phone number"
          : `${trailers.length} trailers, one phone number`
      }
      rule
      action={
        showAllLink && (
          <Link
            to="/trailers"
            className="nav-link text-ink border-b-2 border-amber pb-1 self-start sm:self-auto"
          >
            All trailers →
          </Link>
        )
      }
    />
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {trailers.map((trailer) => (
        <TrailerCard key={trailer._id} trailer={trailer} />
      ))}
    </div>
  </SectionWrapper>
);
