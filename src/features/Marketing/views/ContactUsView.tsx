import * as React from "react";
import { Header } from "~src/shared/ui";
import { ContactUsFormSection } from "../components";

export const ContactUsView = () => {
  return (
    <div className="flex flex-col">
      <Header
        subTitle="Need to get in touch?"
        title="Contact Us"
        description="We are here to help you with any questions you may have."
      />
      <ContactUsFormSection />
    </div>
  );
};
