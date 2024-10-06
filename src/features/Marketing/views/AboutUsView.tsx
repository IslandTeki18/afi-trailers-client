import * as React from "react";
import { Header } from "~src/components";
import {
  AboutOurMissionSection,
  AboutOurTeamSection,
  TestimonialSection,
} from "../components";

const testimonials = [
  {
    name: "Alex Johnson",
    comment:
      "This podcast is fantastic! The storytelling is captivating and the production quality is excellent.",
    rating: 5,
  },
  {
    name: "Sam Smith",
    comment:
      "I'm hooked on this podcast. It's perfect for anyone interested in fascinating stories.",
    rating: 4,
  },
  {
    name: "Taylor Brown",
    comment:
      "I love this podcast! The host's voice is engaging, and the stories are compelling. Highly recommended!",
    rating: 5,
  },
];

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
      <TestimonialSection testimonials={testimonials} />
    </div>
  );
};
