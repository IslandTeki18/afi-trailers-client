import * as React from "react";

type HeaderProps = {
  subTitle: string;
  title: string;
  description: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-4">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="text-base font-semibold leading-7 text-yellow-600">
            {props.subTitle}
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {props.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};
