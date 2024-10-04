import * as React from "react";
import { useParams } from "react-router-dom";
import { Carousel, Header } from "~src/components";
import { Trailer } from "~src/types";
import mockTrailer from "../../Booking/utils/mockTrailer";
import { Badge, Card } from "~src/components";

export const TrailerDetailsView: React.FC = () => {
  const { trailerId } = useParams<{ trailerId: string }>();
  const trailer: Trailer = mockTrailer; // In a real app, fetch the trailer based on trailerId

  if (!trailer) {
    return <div className="text-center p-8">Trailer not found</div>;
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto px-4 py-8">
      <Header
        subTitle={trailer.type}
        title={trailer.name}
        description={trailer.description || ""}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-2">
        <Card header={<h2 className="text-xl font-semibold">Specificaitons</h2>}>
          <p>
            <strong>Capacity:</strong> {trailer.capacity}
          </p>
          <p>
            <strong>Dimensions:</strong> {trailer.dimensions}
          </p>
          <p>
            <strong>Type:</strong> {trailer.type}
          </p>
          <p>
            <strong>Location:</strong> {trailer.location}
          </p>
          <p>
            <strong>Insurance Required:</strong>{" "}
            {trailer.insuranceRequired ? "Yes" : "No"}
          </p>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Pricing</h2>}>
          <p>
            <strong>Half Day Rental:</strong> ${trailer.halfDayRentalPrice}
          </p>
          <p>
            <strong>Full Day Rental:</strong> ${trailer.fullDayRentalPrice}
          </p>
          <p>
            <strong>Weekend Surcharge:</strong> ${trailer.weekendSurcharge}
          </p>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Maintenance</h2>}>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              variant={
                trailer.maintenanceStatus === "Operational"
                  ? "success"
                  : "warning"
              }
            >
              {trailer.maintenanceStatus}
            </Badge>
          </p>
          <p>
            <strong>Last Maintenance:</strong>{" "}
            {trailer.lastMaintenanceDate.toLocaleDateString()}
          </p>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Towing Requirements</h2>}>
          <ul className="list-disc list-inside space-y-1">
            {trailer.towingRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </Card>
      </div>

      {trailer.photos && trailer.photos.length > 0 && (
        <Card className="mt-8" header={<h2 className="text-xl font-semibold">Photos</h2>}>
          <Carousel images={trailer.photos} interval={3000} variant="primary" />
        </Card>
      )}

      {trailer.features && trailer.features.length > 0 && (
        <Card className="mt-8" header={<h2 className="text-xl font-semibold">Features</h2>}>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {trailer.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
