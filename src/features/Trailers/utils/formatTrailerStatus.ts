import { TrailerStatus } from "../types/trailer.types";

export function formatTrailerStatus(status: TrailerStatus): string {
  switch (status) {
    case "available":
      return "Available ✅";
    case "in_use":
      return "In Use 🔄";
    case "out_of_service":
      return "Out of Service ⚠️";
    default:
      return "Unknown";
  }
}
