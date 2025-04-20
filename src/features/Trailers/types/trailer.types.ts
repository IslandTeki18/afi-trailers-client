export type Trailer = {
  _id: string;
  id: string;
  name: string;
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
  rentalRate: {
    amount: number;
    currency: string; // e.g., "USD"
    unit: "hour" | "half_day" | "day" | "week"; // billing unit
  };
  photos?: string[];
  features: string[];
  usageHistory: TrailerUsageHistory[];
  insuranceRequired: boolean;
  towingRequirements: string[];
  serviceTypes: ("full" | "self")[];
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
  tags?: string[];
  isFeatured?: boolean;
  isArchived?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  status: TrailerStatus;
  formattedPrice?: string;
  statusBadge?: string;
};

type TrailerBookedDates = {
  startDate: Date;
  endDate: Date;
  customerId: string;
  bookingId: string;
  timeStamp: Date;
  serviceType: "full" | "self";
  status: "confirmed" | "pending" | "cancelled";
};

type TrailerUsageHistory = {
  _id: string;
  customerId: string;
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
  serviceType: "full" | "self";
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

export type TrailerStatus =
  | 'available'           // Ready to rent
  | 'in_use'              // Out on a rental
  | 'out_of_service'      // Temporarily unavailable (not usable)
  | 'maintenance'         // Actively being serviced
  | 'reserved'            // Upcoming confirmed booking
  | 'pending_approval'    // Awaiting admin confirmation
  | 'archived';           // Soft-deleted or inactive
