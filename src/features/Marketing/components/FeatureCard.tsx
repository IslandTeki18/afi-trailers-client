import * as React from "react";

export type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const FeatureCard = (props: FeatureCardProps) => (
  <div className="border-t-2 border-ink pt-5 flex flex-col gap-3">
    <div className="text-amber-dark">{props.icon}</div>
    <h3 className="display text-[26px] text-ink">{props.title}</h3>
    <p className="text-[15px] leading-relaxed text-body-2">{props.description}</p>
  </div>
);
