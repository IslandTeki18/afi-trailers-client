import * as React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { SectionWrapper, Card, Alert } from "~src/components";

export const TrailerUsageView = () => {
  const allowedItems = [
    "Construction debris (non-hazardous)",
    "Yard waste and landscaping materials",
    "Household junk and furniture",
    "Concrete and asphalt (in small quantities)",
    "Soil and gravel",
    "Scrap metal (non-hazardous)",
  ];

  const prohibitedItems = [
    "Hazardous materials (chemicals, paints, solvents)",
    "Electronics and appliances",
    "Tires",
    "Batteries",
    "Asbestos",
    "Oils and fuels",
    "Biological waste",
    "Radioactive materials",
  ];

  const guidelines = [
    "Do not exceed the weight limit specified for the trailer",
    "Distribute the load evenly across the trailer bed",
    "Make sure no debris is sticking out of the trailer",
    "Tarp must cover the load entirely during transit",
    "Clean the trailer thoroughly after use",
  ];

  return (
    <SectionWrapper paddingY="small" className="flex flex-col">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Dump Trailer Usage Guidelines
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card
          variant="success"
          header={
            <h2 className="text-2xl font-semibold flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-2" />
              Allowed Items
            </h2>
          }
        >
          <ul className="list-disc pl-6 space-y-2">
            {allowedItems.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card
          variant="accent"
          header={
            <h2 className="text-2xl font-semibold flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500 mr-2" />
              Prohibited Items
            </h2>
          }
        >
          <ul className="list-disc pl-6 space-y-2">
            {prohibitedItems.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card
          variant="neutral"
          header={
            <h2 className="text-2xl font-semibold flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mr-2" />
              Usage Guidelines
            </h2>
          }
        >
          <ul className="list-disc pl-6 space-y-2">
            {guidelines.map((guideline, index) => (
              <li key={index} className="text-gray-700">
                {guideline}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Alert
        variant="danger"
        title="Important Notice"
        message="Failure to comply with these guidelines may result in additional fees,
          denial of service, or legal action. If you're unsure about any items
          or have questions, please contact us before loading the trailer. (801)
          609-4144"
        icon={<ExclamationTriangleIcon className="h-8 w-8 text-red-500" />}
      />
    </SectionWrapper>
  );
};
