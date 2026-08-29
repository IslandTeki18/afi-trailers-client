import * as React from "react";
import { Header } from "~src/components";
import { ContactUsFormSection } from "../components";

export const ContactUsView = () => (
  <>
    <Header
      subTitle="Contact"
      title="Call, text or send a note"
      description="Questions about a load, a date or whether your truck can tow it. Landon answers."
    />
    <ContactUsFormSection />
  </>
);
