import * as React from "react";
import { Header } from "~src/components";
import {
  AboutOurMissionSection,
  AboutOurTeamSection,
  TestimonialSection,
  WhyRentWithUsSection,
} from "../components";
import { aboutTestimonials } from "../utils/aboutTestimonials";

export const AboutUsView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="About Us"
        title="About Our Company"
        description="We are a team of passionate individuals who are dedicated to providing the best service to our customers. Our mission is to make it easy for you to find the perfect trailer for your needs."
      />
      <AboutOurMissionSection />
      <AboutOurTeamSection />
      <WhyRentWithUsSection />
      <TestimonialSection testimonials={aboutTestimonials} />
    </div>
  );
};
