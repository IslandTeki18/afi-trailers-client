import * as React from "react";
import { Button, SectionWrapper } from "~src/components";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import dumpTrailerImage from "../../assets/7x14Dump_Trailer_Front.jpg";

export const HeroImageSection = () => {
  const navigate = useNavigate();
  return (
    <SectionWrapper paddingY="small">
      <div className="relative flex flex-col">
        <div className="flex flex-col items-start">
          <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
            <div className="max-w-xl mb-6">
              <div>
                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                  Trailer Rentals
                </p>
              </div>
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                AFI Trailers offers the best trailer rentals in south{" "}
                <br className="hidden md:block" />
                <span className="inline-block text-yellow-400">
                  Utah County
                </span>
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Get the job done with our durable dump trailers, perfect for
                hauling, cleanup, and construction projects. Whether you're
                moving debris, dirt, or heavy materials, our trailers are built
                to handle it all with ease.
              </p>
            </div>
            <div className="flex flex-col items-center md:flex-row gap-4">
              <Button onClick={() => navigate("/trailers")}>
                Find a Trailer
              </Button>
            </div>
          </div>
        </div>
        <div className="inset-y-0 right-0 w-full mx-auto lg:w-1/2 lg:max-w-full lg:absolute xl:px-0">
          <img
            className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none sm:h-96 lg:h-full"
            src={dumpTrailerImage}
            alt="dump trailer"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
