import * as React from "react";
import { Drawer } from "../../../shared/ui/Drawer";

interface TrailerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId?: string;
}

interface TrailerDetails {
  id: string;
  title: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status?: "available" | "in_use" | "maintenance";
  lastMaintenance?: Date;
}

export const TrailerDetailsDrawer: React.FC<TrailerDetailsDrawerProps> = ({
  isOpen,
  onClose,
  trailerId,
}) => {
    // Simulated trailer details data
  const trailerDetails: TrailerDetails | null = trailerId
    ? {
        id: trailerId,
        title: "Trailer Example",
        description: "This is an example trailer description.",
        manufacturer: "Example Manufacturer",
        model: "Heavy Duty 5000",
        year: 2022,
        dimensions: {
          length: 20,
          width: 8,
          height: 10,
        },
        status: "available",
        lastMaintenance: new Date("2023-09-15"),
      }
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={trailerDetails?.title || "Trailer Details"}
      position="right"
      maxWidth="md"
      bgColor="bg-white"
    >
      {trailerDetails ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg">General Information</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">
                  Manufacturer:
                </dt>
                <dd className="text-sm text-gray-900">
                  {trailerDetails.manufacturer}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Model:</dt>
                <dd className="text-sm text-gray-900">
                  {trailerDetails.model}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Year:</dt>
                <dd className="text-sm text-gray-900">{trailerDetails.year}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                <dd className="text-sm text-gray-900 capitalize">
                  {trailerDetails.status?.replace("_", " ")}
                </dd>
              </div>
            </dl>
          </div>

          {trailerDetails.dimensions && (
            <div>
              <h3 className="font-medium text-lg">Dimensions</h3>
              <dl className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Length:</dt>
                  <dd className="text-sm text-gray-900">
                    {trailerDetails.dimensions.length} ft
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Width:</dt>
                  <dd className="text-sm text-gray-900">
                    {trailerDetails.dimensions.width} ft
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Height:</dt>
                  <dd className="text-sm text-gray-900">
                    {trailerDetails.dimensions.height} ft
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {trailerDetails.description && (
            <div>
              <h3 className="font-medium text-lg">Description</h3>
              <p className="mt-2 text-sm text-gray-600">
                {trailerDetails.description}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-medium text-lg">Maintenance</h3>
            <p className="mt-2 text-sm text-gray-600">
              Last maintenance:{" "}
              {trailerDetails.lastMaintenance?.toLocaleDateString()}
            </p>
          </div>

          {/* Additional sections can be added here as needed */}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500">
            No trailer selected or trailer details not found.
          </p>
        </div>
      )}
    </Drawer>
  );
};
