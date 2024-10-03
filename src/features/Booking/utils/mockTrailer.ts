import { Trailer } from "~src/types"; // Assume you have a types file

const mockDumpTrailer: Trailer = {
  _id: "dump123",
  name: "Heavy Duty Dump Trailer",
  capacity: "14,000 lbs",
  dimensions: "14' x 7' x 4'",
  type: "Dump Trailer",
  halfDayRentalPrice: 75,
  fullDayRentalPrice: 120,
  weekendSurcharge: 25,
  maintenanceStatus: "Operational",
  lastMaintenanceDate: new Date("2024-09-15"),
  bookedDates: [
    {
      startDate: new Date("2024-10-05"),
      endDate: new Date("2024-10-07"),
      customerId: 1001,
      bookingId: "book001",
      timeStamp: new Date("2024-09-20T10:30:00"),
    },
    {
      startDate: new Date("2024-10-15"),
      endDate: new Date("2024-10-16"),
      customerId: 1002,
      bookingId: "book002",
      timeStamp: new Date("2024-09-25T14:45:00"),
    },
    {
      startDate: new Date("2024-10-20"),
      endDate: new Date("2024-10-22"),
      customerId: 1003,
      bookingId: "book003",
      timeStamp: new Date("2024-09-30T09:15:00"),
    },
    {
      startDate: new Date("2024-10-28"),
      endDate: new Date("2024-10-31"),
      customerId: 1004,
      bookingId: "book004",
      timeStamp: new Date("2024-10-01T16:20:00"),
    },
    {
      startDate: new Date("2024-11-10"),
      endDate: new Date("2024-11-12"),
      customerId: 1005,
      bookingId: "book005",
      timeStamp: new Date("2024-10-05T11:00:00"),
    },
  ],
  location: "Main Storage Yard",
  photos: [
    "https://example.com/dump-trailer-1.jpg",
    "https://example.com/dump-trailer-2.jpg",
  ],
  features: [
    "Hydraulic lift",
    "Double rear doors",
    "Tarp cover",
    "Heavy-duty axles",
  ],
  usageHistory: [
    {
      _id: "use001",
      customerId: 1003,
      rentalPeriod: {
        start: new Date("2024-08-10"),
        end: new Date("2024-08-12"),
      },
      totalPaid: 240,
    },
    {
      _id: "use002",
      customerId: 1004,
      rentalPeriod: {
        start: new Date("2024-09-01"),
        end: new Date("2024-09-01"),
      },
      totalPaid: 75,
    },
  ],
  insuranceRequired: true,
  towingRequirements: [
    "3/4 ton truck or larger",
    '2 5/16" ball hitch',
    "7-pin trailer connector",
  ],
};

export default mockDumpTrailer;
