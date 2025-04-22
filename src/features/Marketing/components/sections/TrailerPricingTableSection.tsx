import * as React from "react";
import { Button, SectionWrapper } from "~src/shared/ui";

interface TrailerPrice {
  type: string;
  size: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

const trailerPrices: TrailerPrice[] = [
  {
    type: "Dump Trailer",
    size: "10ft",
    dailyRate: 75,
    weeklyRate: 375,
    monthlyRate: 1125,
  },
  {
    type: "Flatbed Trailer",
    size: "20ft",
    dailyRate: 60,
    weeklyRate: 300,
    monthlyRate: 900,
  },
  {
    type: "Enclosed Trailer",
    size: "16ft",
    dailyRate: 85,
    weeklyRate: 425,
    monthlyRate: 1275,
  },
  {
    type: "Car Hauler",
    size: "18ft",
    dailyRate: 70,
    weeklyRate: 350,
    monthlyRate: 1050,
  },
  {
    type: "Utility Trailer",
    size: "5x8",
    dailyRate: 40,
    weeklyRate: 200,
    monthlyRate: 600,
  },
];

export const TrailerPricingTableSection = () => {
  return (
    <SectionWrapper>
      <div className="sm:flex sm:items-center">
        <div className="flex-auto text-left">
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Trailer Pricing
          </h2>
          <p className="mt-6 max-w-3xl text-left text-lg leading-8 text-gray-600">
            Either you can do it yourself or we can do it for you. We offer
            both. Choose the option that works best for you and the project you
            are working on.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button variant="secondary">View All Trailers</Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Trailer Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Daily Rate
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Weekly Rate
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Monthly Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {trailerPrices.map((trailer) => (
                    <tr key={trailer.type}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {trailer.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {trailer.size}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${trailer.dailyRate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${trailer.weeklyRate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${trailer.monthlyRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
