import * as React from "react";
import { Card, SectionWrapper } from "~src/components";
import { contractFullServiceSections } from "../utils/contactSections";

export const RentalContractView: React.FC = () => {
  return (
    <SectionWrapper className="text-white" paddingY="small">
      <h1 className="text-3xl text-gray-900 font-bold mb-8 text-center">
        Full Service Rental Contract Breakdown
      </h1>

      {contractFullServiceSections.map((section, index) => (
        <Card key={index} className="mb-6" variant="dark-primary">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contract Text:</h3>
              {section.formalText.length > 1 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {section.formalText.map((text, i) => (
                    <li key={i} className="text-sm">
                      {text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{section.formalText}</p>
              )}
            </div>
            <div className="bg-gray-100 p-4 rounded text-gray-900 h-fit">
              <h3 className="font-semibold mb-2">Simple Explanation:</h3>
              <p className="text-sm">{section.simpleExplanation}</p>
            </div>
          </div>
        </Card>
      ))}
    </SectionWrapper>
  );
};
