import * as React from "react";
import { useParams } from "react-router-dom";
import { Button, Carousel, Header } from "~src/components";
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
      {trailer.photos && trailer.photos.length > 0 && (
        <Card
          className="mt-8"
          header={<h2 className="text-xl font-semibold">Photos</h2>}
        >
          <Carousel images={trailer.photos} interval={3000} variant="primary" />
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card
          header={<h2 className="text-xl font-semibold">Specificaitons</h2>}
        >
          <div className="flex flex-col gap-4">
            <p className="flex justify-between items-center">
              <strong>Capacity:</strong> {trailer.capacity}
            </p>
            <p className="flex justify-between items-center">
              <strong>Dimensions:</strong> {trailer.dimensions}
            </p>
            <p className="flex justify-between items-center">
              <strong>Type:</strong> {trailer.type}
            </p>
            <p className="flex justify-between items-center">
              <strong>Location:</strong> {trailer.location}
            </p>
            <p className="flex justify-between items-center">
              <strong>Insurance Required:</strong>{" "}
              {trailer.insuranceRequired ? "Yes" : "No"}
            </p>
          </div>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Pricing</h2>}>
          <div className="flex flex-col gap-4">
            <p className="flex justify-between items-center">
              <strong>Half Day Rental:</strong> ${trailer.halfDayRentalPrice}
            </p>
            <p className="flex justify-between items-center">
              <strong>Full Day Rental:</strong> ${trailer.fullDayRentalPrice}
            </p>
            <p className="flex justify-between items-center">
              <strong>Weekend Surcharge:</strong> ${trailer.weekendSurcharge}
            </p>
          </div>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Maintenance</h2>}>
          <div className="flex flex-col gap-4">
            <p className="flex justify-between items-center">
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
            <p className="flex justify-between items-center">
              <strong>Last Maintenance:</strong>{" "}
              {trailer.lastMaintenanceDate.toLocaleDateString()}
            </p>
          </div>
        </Card>

        <Card
          header={
            <h2 className="text-xl font-semibold">Towing Requirements</h2>
          }
        >
          <ul className="list-disc list-inside space-y-1">
            {trailer.towingRequirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </Card>
      </div>

      {trailer.features && trailer.features.length > 0 && (
        <Card
          className="mt-8"
          header={<h2 className="text-xl font-semibold">Features</h2>}
        >
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
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <Button className="w-1/3" variant="primary">
          Book Now
        </Button>
      </div>
    </div>
  );
};
