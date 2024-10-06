import * as React from "react";

interface Fee {
  name: string;
  amount: number;
  description: string;
}

export const AdditionalFeesSection: React.FC = () => {
  const additionalFees: Fee[] = [
    {
      name: "Security Deposit",
      amount: 500,
      description: "Refundable deposit to cover potential damages",
    },
    {
      name: "Late Return Fee (Self-Service Only)",
      amount: 50,
      description:
        "Per day charge for returning the trailer after the agreed-upon date",
    },
    {
      name: "Optional Insurance",
      amount: 25,
      description: "Daily rate for comprehensive insurance coverage",
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex-auto text-left">
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Additional Fees
          </h2>
          <p className="my-6 max-w-3xl text-left text-lg leading-8 text-gray-600">
            We offer a variety of additional fees to cover potential damages,
            late returns, and insurance coverage. Please review the following:
          </p>
        </div>
        <div className="space-y-6">
          {additionalFees.map((fee) => (
            <div
              key={fee.name}
              className="bg-slate-900 shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white flex justify-between">
                  {fee.name}
                  <span className="text-white text-2xl">${fee.amount}</span>
                </h3>
                <p className="mt-1 text-sm text-gray-300">{fee.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
