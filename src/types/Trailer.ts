export type Trailer = {
  _id: string;
  name: string;
  capacity: string;
  dimensions: string;
  type: string;
  halfDayRentalPrice?: number;
  fullDayRentalPrice?: number;
  weekendSurcharge?: number;
  maintenanceStatus: "Operational" | "Maintenance" | "Out of Service";
  lastMaintenanceDate: Date;
  bookedDates: TrailerBookedDates[];
  location: string;
  photos?: string[];
  features: string[];
  usageHistory: TrailerUseageHistory[];
  insuranceRequired: boolean;
  towingRequirements: string[];
};

type TrailerBookedDates = {
  startDate: Date;
  endDate: Date;
  customerId: number;
  bookingId: string;
  timeStamp: Date;
};

type TrailerUseageHistory = {
  _id: string;
  customerId: number;
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
};
