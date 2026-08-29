import * as React from "react";
import { SectionWrapper, SectionHeading } from "~src/components";

export const AboutOurMissionSection = () => (
  <SectionWrapper className="bg-bone">
    <SectionHeading eyebrow="Our mission" title="Make the job easier" rule />
    <div className="grid gap-10 lg:grid-cols-2">
      <p className="text-xl leading-relaxed text-body">
        Our mission is to make your projects easier by providing reliable dump
        trailer rentals at affordable prices. We aim to offer top-quality
        equipment and friendly service so you can get the job done without
        hassle. Whether you're tackling a home cleanup, landscaping, or a
        construction project, we're dedicated to supporting your needs every
        step of the way.
      </p>
      <div className="flex flex-col gap-6 text-base leading-relaxed text-body-2">
        <p>
          We currently offer one reliable 14-yard dump trailer, perfect for a
          wide range of projects from home renovations to construction cleanups.
          While we're starting small, we're committed to delivering the same
          top-tier service and quality that you can rely on. This trailer is
          well-maintained and ready to handle your toughest jobs.
        </p>
        <p>
          Looking ahead, we're excited to expand our fleet and give you even more
          options for your projects. As we grow, our mission remains the same:
          to provide dependable, hassle-free rentals at competitive prices.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
