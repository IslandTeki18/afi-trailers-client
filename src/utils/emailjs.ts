import emailjs from "@emailjs/browser";

// ponytail: one EmailJS template for both contact messages and booking requests;
// add a dedicated booking template when the inbox needs to tell them apart.
const EMAILJS = {
  serviceId: "service_b6xrxba",
  templateId: "template_44itu0w",
  publicKey: "ODsr07SdqIg3ETyWk",
} as const;

export type EmailMessage = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function sendEmail(params: EmailMessage) {
  return emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params, {
    publicKey: EMAILJS.publicKey,
  });
}
