import * as React from "react";

export type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const FeatureCard = (props: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-yellow-100">
      {props.icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{props.title}</h3>
    <p className="text-gray-600">{props.description}</p>
  </div>
);
