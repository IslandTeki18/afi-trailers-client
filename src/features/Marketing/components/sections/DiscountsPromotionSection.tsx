import * as React from "react";
import { TagIcon } from "@heroicons/react/20/solid";

interface Discount {
  name: string;
  description: string;
  discountAmount: string;
  validUntil: string;
  isSeasonalDeal: boolean;
}

export const DiscountsPromotionsSection: React.FC = () => {
  const discounts: Discount[] = [
    {
      name: "Summer Special",
      description:
        "Enjoy discounted rates on all trailers during the summer months!",
      discountAmount: "15% off",
      validUntil: "2024-08-31",
      isSeasonalDeal: true,
    },
    {
      name: "Long-term Rental Discount",
      description: "Save more when you rent for longer periods.",
      discountAmount: "20% off for rentals over 30 days",
      validUntil: "2024-12-31",
      isSeasonalDeal: false,
    },
    {
      name: "Winter Getaway Deal",
      description: "Special rates for winter camping enthusiasts!",
      discountAmount: "10% off",
      validUntil: "2025-02-28",
      isSeasonalDeal: true,
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-900 uppercase rounded-full bg-yellow-400">
              Our Pricing
            </p>
          </div>
          <p className="mt-2 mb-24 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Affordable trailer rental options
          </p>
        </div>
        <div className="space-y-6">
          {discounts.map((discount) => (
            <div
              key={discount.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {discount.name}
                  </h3>
                  {discount.isSeasonalDeal && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <TagIcon className="w-4 h-4 mr-1" />
                      Seasonal
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{discount.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-yellow-600">
                    {discount.discountAmount}
                  </span>
                  <span className="text-sm text-gray-500">
                    Valid until: {discount.validUntil}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
