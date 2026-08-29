import * as React from "react";
import { Link } from "react-router-dom";
import { SectionWrapper, ButtonLink } from "~src/components";

export const TrailerNotFound = () => (
  <SectionWrapper>
    <span className="eyebrow text-amber-dark">404</span>
    <h1 className="display text-5xl sm:text-7xl text-ink mt-3 mb-5">Trailer not found</h1>
    <p className="max-w-xl text-lg leading-relaxed text-body-2 mb-8">
      That trailer isn't in the fleet. It may have been removed or the link is
      wrong. If you think this is an error,{" "}
      <Link to="/contact" className="text-amber-dark underline">
        contact us
      </Link>
      .
    </p>
    <ButtonLink to="/trailers">See all trailers</ButtonLink>
  </SectionWrapper>
);
