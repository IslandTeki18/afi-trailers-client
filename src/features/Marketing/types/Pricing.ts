export type PricingFrequency = {
  value: "fullService" | "selfService";
  label: string;
  priceSuffix: string;
};

export type PricingTier = {
  id: string;
  name: string;
  description: string;
  price: { fullService: string; selfService: string } | string;
  featured: boolean;
  href: string;
  cta: string;
  features: { fullService: string[]; selfService: string[] };
};
