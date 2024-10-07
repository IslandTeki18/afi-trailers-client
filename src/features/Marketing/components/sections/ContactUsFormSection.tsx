import * as React from "react";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, SectionWrapper, Textarea } from "~src/components";

type ContactUsFormSectionProps = {};

export const ContactUsFormSection = (props: ContactUsFormSectionProps) => {
  return (
    <SectionWrapper paddingY="small">
      <div className="relative isolate bg-white">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="relative pb-20 pt-10 sm:pt-24 lg:static">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Get in touch
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                If you have any questions or would like to learn more about our
                services, please don't hesitate to reach out. We're here to
                help!
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Address</span>
                    <BuildingOffice2Icon
                      aria-hidden="true"
                      className="h-7 w-6 text-gray-400"
                    />
                  </dt>
                  <dd>
                    1234 North Main Street
                    <br />
                    Spanish Fork, UT 84660
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Telephone</span>
                    <PhoneIcon
                      aria-hidden="true"
                      className="h-7 w-6 text-gray-400"
                    />
                  </dt>
                  <dd>
                    <a
                      href="tel:+1 (555) 234-5678"
                      className="hover:text-gray-900"
                    >
                      +1 (555) 234-5678
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon
                      aria-hidden="true"
                      className="h-7 w-6 text-gray-400"
                    />
                  </dt>
                  <dd>
                    <a
                      href="mailto:hello@example.com"
                      className="hover:text-gray-900"
                    >
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <form className="pb-24 pt-20 sm:pb-32">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <Input
                  label="First name"
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                />
                <Input
                  label="Last name"
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Phone number"
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Message"
                    id="message"
                    name="message"
                    rows={4}
                    value=""
                    onChange={() => {}}
                    variant="primary"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button type="submit" disabled>
                  Send message
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};
