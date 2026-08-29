import * as React from "react";
import { Header } from "~src/components";
import {
  AboutOurMissionSection,
  AboutOurTeamSection,
  TestimonialSection,
  WhyRentWithUsSection,
} from "../components";
import { aboutTestimonials } from "../utils/aboutTestimonials";

export const AboutUsView = () => (
  <>
    <Header
      subTitle="About"
      title="Team of one"
      description="Owner-operated dump trailer rental out of Spanish Fork. You talk to the person who owns the trailer, every time."
    />
    <AboutOurTeamSection />
    <AboutOurMissionSection />
    <WhyRentWithUsSection />
    <TestimonialSection testimonials={aboutTestimonials} />
  </>
);
