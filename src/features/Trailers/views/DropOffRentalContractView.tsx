import * as React from "react";
import { ContractView } from "../components/ContractView";
import { contractFullServiceSections } from "../utils/dropOffContractSections";

export const DropOffRentalContractView: React.FC = () => (
  <ContractView
    eyebrow="Full service"
    title="Drop-off contract"
    description="The rental agreement for full service rentals, where we deliver, pick up, dump and clean. Formal text on the left, plain terms on the right."
    sections={contractFullServiceSections}
  />
);
