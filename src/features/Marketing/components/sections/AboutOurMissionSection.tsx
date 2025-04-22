import * as React from "react";
import { SectionWrapper } from "~src/shared/ui";

const stats = [
  { label: "of junk/garbage removed", value: "15+ tonnes" },
  { label: "customers served", value: "10+" },
  { label: "sod and other material delivered", value: "3 acres" },
];

type AboutOurMissionSectionProps = {};

export const AboutOurMissionSection = (props: AboutOurMissionSectionProps) => {
  return (
    <SectionWrapper paddingY="small">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Our mission
      </h2>
      <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
        <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
          <p className="text-xl leading-8 text-gray-600">
            Our mission is to make your projects easier by providing reliable
            dump trailer rentals at affordable prices. We aim to offer
            top-quality equipment and friendly service so you can get the job
            done without hassle. Whether you're tackling a home cleanup,
            landscaping, or a construction project, we're dedicated to
            supporting your needs every step of the way.
          </p>
          <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
            <p>
              We currently offer one reliable 14-yard dump trailer, perfect for
              a wide range of projects from home renovations to construction
              cleanups. While we’re starting small, we’re committed to
              delivering the same top-tier service and quality that you can rely
              on. This trailer is well-maintained and ready to handle your
              toughest jobs.
            </p>
            <p className="mt-10">
              Looking ahead, we’re excited to expand our fleet. Over the next
              four months, we plan to add three more trailers to give you even
              more options for your projects. As we grow, our mission remains
              the same: to provide dependable, hassle-free rentals at
              competitive prices.
            </p>
          </div>
        </div>
        <div className="lg:flex lg:flex-auto lg:justify-center">
          <dl className="w-64 space-y-8 xl:w-80">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                <dt className="text-base leading-7 text-gray-600">
                  {stat.label}
                </dt>
                <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionWrapper>
  );
};
