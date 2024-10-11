export type Trailer = {
  _id: string;
  name: string;
  capacity: string;
  dimensions: string;
  description?: string;
  type: string;
  halfDayRentalPrice?: number;
  fullDayRentalPrice: number; // Changed to required
  deliveryFee: number; // Added as required for full-service option
  weekendSurcharge?: number;
  maintenanceStatus: "Operational" | "Maintenance" | "Out of Service";
  lastMaintenanceDate: Date;
  bookedDates: TrailerBookedDates[];
  location: string;
  photos?: string[];
  features: string[];
  usageHistory: TrailerUsageHistory[]; // Fixed typo in name
  insuranceRequired: boolean;
  towingRequirements: string[];
  serviceTypes: ("full" | "self")[]; // Added to specify available service types
};

type TrailerBookedDates = {
  startDate: Date;
  endDate: Date;
  customerId: string; // Changed to string to match potential UUID format
  bookingId: string;
  timeStamp: Date;
  serviceType: "full" | "self"; // Added to track the type of service booked
};

type TrailerUsageHistory = {
  _id: string;
  customerId: string; // Changed to string to match potential UUID format
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
  serviceType: "full" | "self"; // Added to track the type of service used
};