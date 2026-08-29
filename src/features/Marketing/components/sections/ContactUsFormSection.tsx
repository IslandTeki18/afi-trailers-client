import * as React from "react";
import { useState } from "react";
import { Button, Input, SectionWrapper, Textarea } from "~src/components";
import { business } from "~src/data/business";
import { sendEmail } from "~src/utils/emailjs";

const emptyForm = { name: "", email: "", phone: "", message: "" };
type Status = "idle" | "sending" | "sent" | "error";

export const ContactUsFormSection = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendEmail(formData);
      setFormData(emptyForm);
      setStatus("sent");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  const details = [
    { label: "Phone", value: business.phoneDisplay, href: business.phoneHref },
    { label: "Email", value: business.email, href: `mailto:${business.email}` },
    { label: "Yard", value: business.address },
  ];

  return (
    <SectionWrapper className="bg-bone">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5">
          <span className="eyebrow text-amber-dark">Contact</span>
          <h2 className="display text-4xl sm:text-[54px] text-ink">Get in touch</h2>
          <p className="text-[17px] leading-relaxed text-body-2">
            Questions about a load, a date or whether your truck can tow it —
            call or text. Fastest answer is always the phone.
          </p>
          <dl className="flex flex-col border-t border-rule mt-2">
            {details.map((d) => (
              <div key={d.label} className="kv-row py-4">
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-mute">
                  {d.label}
                </dt>
                <dd className="font-display font-semibold text-xl leading-none text-ink text-right break-all">
                  {d.href ? <a href={d.href}>{d.value}</a> : d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper border border-rule p-6 sm:p-9 flex flex-col gap-5"
        >
          <Input
            label="Full name"
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
            value={formData.name}
            onChange={set("name")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john.doe@example.com"
              required
              value={formData.email}
              onChange={set("email")}
            />
            <Input
              label="Phone"
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 234-5678"
              value={formData.phone}
              onChange={set("phone")}
            />
          </div>
          <Textarea
            label="Message"
            id="message"
            name="message"
            placeholder="Tell us how we can help you!"
            rows={4}
            required
            value={formData.message}
            onChange={set("message")}
          />
          <Button type="submit" disabled={status === "sending"} className="w-full">
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
          {status === "sent" && (
            <p className="text-sm text-body" role="status">
              Your message has been sent. We will get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-rust" role="alert">
              Something went wrong. Call or text {business.phoneDisplay} instead.
            </p>
          )}
        </form>
      </div>
    </SectionWrapper>
  );
};
