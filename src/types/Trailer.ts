export type Trailer = {
  _id: string;
  name: string;
  capacity: string;
  dimensions: string; 
  type: string;
  isAvailable: boolean;
  halfDayRentalPrice?: number;
  fullDayRentalPrice?: number;
  rentalPricePerWeek?: number; 
  rentalPricePerMonth?: number; 
  maintenanceStatus: "Operational" | "Maintenance" | "Out of Service"; 
  lastMaintenanceDate: Date; 
  nextAvailableDate: Date | null;
  location: string;
  photos?: string[];
  features: string[]; 
  usageHistory: TrailerUseageHistory[];
  insuranceRequired: boolean;
  towingRequirements: string[];
};

type TrailerUseageHistory = {
  _id: string;
  customerId: number;
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
};
