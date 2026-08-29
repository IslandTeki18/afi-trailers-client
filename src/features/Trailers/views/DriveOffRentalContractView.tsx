import * as React from "react";
import { ContractView } from "../components/ContractView";
import { contractSelfServiceSections } from "../utils/driveOffContractSections";

export const DriveOffRentalContractView: React.FC = () => (
  <ContractView
    eyebrow="Self service"
    title="Drive-off contract"
    description="The rental agreement for self service rentals, where you tow, fill, dump and return the trailer. Formal text on the left, plain terms on the right."
    sections={contractSelfServiceSections}
  />
);
