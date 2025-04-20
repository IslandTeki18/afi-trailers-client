export const TRAILER_STATUSES = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  OUT_OF_SERVICE: "out_of_service",
  MAINTENANCE: "maintenance",
  RESERVED: "reserved",
  PENDING_APPROVAL: "pending_approval",
  ARCHIVED: "archived",
} as const;

export type TrailerStatus =
  (typeof TRAILER_STATUSES)[keyof typeof TRAILER_STATUSES];
