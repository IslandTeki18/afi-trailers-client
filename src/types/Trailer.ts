export type ServiceType = "full" | "self";
export type RentalType = "half" | "full";

export type Trailer = {
  _id: string;
  name: string;
  shortName: string;
  capacity: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  type: string;
  rentalPrices: {
    halfDay?: number;
    fullDay: number;
  };
  deliveryFee: number;
  weekendSurcharge?: number;
  maintenanceStatus: "Operational" | "Maintenance" | "Out of Service";
  lastMaintenanceDate: Date | null;
  nextScheduledMaintenance?: Date | null;
  bookedDates: TrailerBookedDates[];
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  photos?: string[];
  features: string[];
  usageHistory: TrailerUsageHistory[];
  insuranceRequired: boolean;
  towingRequirements: string[];
  serviceTypes: ServiceType[];
  weight: {
    empty: number;
    maxLoad: number;
  };
  availability: {
    isAvailable: boolean;
    nextAvailableDate?: Date;
  };
  ratings: {
    averageRating: number;
    totalReviews: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

type TrailerBookedDates = {
  startDate: Date;
  endDate: Date;
  customerId: string;
  bookingId: string;
  timeStamp: Date;
  serviceType: ServiceType;
  status: "confirmed" | "pending" | "cancelled";
};

type TrailerUsageHistory = {
  _id: string;
  customerId: string;
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
  serviceType: ServiceType;
  feedback?: {
    rating: number;
    comment?: string;
  };
  incidentReport?: {
    description: string;
    dateReported: Date;
    resolved: boolean;
  };
};
