import * as React from 'react'
import { Header } from "~src/components";
import { AboutOurTeamSection } from '../components';


export const AboutUsView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="About Us"
        title="Who We Are"
        description="We are a team of professionals who are dedicated to providing the best service to our customers."
      />
      <AboutOurTeamSection />
    </div>
  );
}