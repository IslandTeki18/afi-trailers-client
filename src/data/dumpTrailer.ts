import { Trailer } from "~src/types";
// @ts-ignore
import dumpTrailerImage from "url:~src/features/Marketing/assets/7x14Dump_Trailer.jpg";

export const dumpTrailer: Trailer = {
  _id: "st7x14x4dump001",
  name: "Southland 7x14 Dump Trailer",
  capacity: "14,100 lbs",
  dimensions: {
    length: 14,
    width: 7,
    height: 4,
  },
  description:
    "Heavy-duty 7x14x4 dump trailer from Southland Trailers, perfect for construction and landscaping projects. This trailer is perfect for hauling junk, dirt, gravel, and other materials. It has a 14,000 lb. payload capacity.",
  type: "Dump Trailer",
  rentalPrices: {
    halfDay: 60,
    fullDay: 80,
  },
  deliveryFee: 20,
  weekendSurcharge: 25,
  maintenanceStatus: "Operational",
  lastMaintenanceDate: null,
  nextScheduledMaintenance: null,
  bookedDates: [],
  location: {
    address: "Spanish Fork, UT",
  },
  photos: [dumpTrailerImage],
  features: [
    "Hydraulic lift",
    "Double rear doors",
    "LED lights",
    "Heavy-duty frame",
    "Tarp kit",
    '2 5/16" ball hitch',
    "7-pin connector",
    "10,000 lb. load capacity",
  ],
  usageHistory: [
    {
      _id: "usage789",
      customerId: "cust456",
      rentalPeriod: {
        start: new Date("2024-09-01"),
        end: new Date("2024-09-03"),
      },
      totalPaid: 575,
      serviceType: "full",
      feedback: {
        rating: 4.5,
        comment: "Great trailer, easy to use. Delivery was on time.",
      },
    },
  ],
  insuranceRequired: false,
  towingRequirements: [
    "3/4 ton pickup or larger",
    '2 5/16" ball hitch',
    "7-pin connector",
  ],
  serviceTypes: ["full"],
  weight: {
    empty: 4100,
    maxLoad: 10000,
  },
  availability: {
    isAvailable: true,
    nextAvailableDate: new Date("2024-10-23"),
  },
  ratings: {
    averageRating: 0,
    totalReviews: 0,
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-10-11"),
};
