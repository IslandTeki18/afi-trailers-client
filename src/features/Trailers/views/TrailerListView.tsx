import * as React from "react";
import { Header } from "~src/components";
import { FeaturedTrailersSection } from "~src/features/Marketing/components";

export const TrailerListView = () => (
  <>
    <Header
      subTitle="The fleet"
      title="Trailers"
      description="Every trailer we rent, with specs and posted rates. Pick the one that fits the job."
    />
    <FeaturedTrailersSection showAllLink={false} />
  </>
);
