import * as React from "react";
import { SectionWrapper } from "~src/components";
// @ts-ignore
import portfolioImage from "url:../../assets/portfolio.jpeg";

type AboutOurTeamSectionProps = {};

const people = [
  {
    name: "Landon McKell",
    role: "Owner and Operator",
    imageUrl:
      portfolioImage,
    bio: "Landon started helping friends and family with his dump trailer and decided to share it everyone to get rid of their junk! He brings the pacific islander work ethic and passion for customer service to the trailer rental business.",
  },
];

export const AboutOurTeamSection = (props: AboutOurTeamSectionProps) => {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl sm:text-center">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
            About Us
          </p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Team of One
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Right now it's just Landon, but he's the best! He's passionate about
          providing the best customer service and trailer rental experience in Utah County.
        </p>
      </div>
      <ul
        role="list"
        className="mx-auto mt-20 grid grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:gap-x-8 xl:max-w-none"
      >
        {people.map((person) => (
          <li key={person.name} className="flex flex-col gap-6 xl:flex-row">
            <img
              alt=""
              src={person.imageUrl}
              className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
            />
            <div className="flex-auto">
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">{person.role}</p>
              <p className="mt-6 text-base leading-7 text-gray-600">
                {person.bio}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};
