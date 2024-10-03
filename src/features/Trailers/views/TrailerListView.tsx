import * as React from "react";
import { Header } from "~src/components";
import { FeaturedTrailersSection } from "~src/features/Marketing/components";

export const TrailerListView = () => {
  return (
    <div className="felx flex-col">
      <Header
        subTitle="All the trailers we offer"
        title="A List of our Trailers"
        description="Find a trailer that best fits your project needs."
      />
      <FeaturedTrailersSection />
    </div>
  );
};
