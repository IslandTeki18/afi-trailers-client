import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Carousel, Header, Badge, Card } from "~src/components";
import { Trailer } from "~src/types";
import { dumpTrailer } from "~src/data/dumpTrailer";
import { CheckIcon, StarIcon } from "@heroicons/react/20/solid";
import { TrailerNotFound } from "../components";

export const TrailerDetailsView: React.FC = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const trailer: Trailer = dumpTrailer;

  if (!trailer) {
    return <TrailerNotFound />;
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
          <img src={trailer.photos[0]} alt="dump trailer" />
          {/* <Carousel images={trailer.photos} interval={7000} variant="primary" /> */}
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card
          header={<h2 className="text-xl font-semibold">Specifications</h2>}
        >
          <div className="flex flex-col gap-4">
            <p className="flex justify-between items-center">
              <strong>Capacity:</strong> {trailer.capacity}
            </p>
            <p className="flex justify-between items-center">
              <strong>Dimensions:</strong>{" "}
              {`${trailer.dimensions.length}L x ${trailer.dimensions.width}W x ${trailer.dimensions.height}H`}
            </p>
            <p className="flex justify-between items-center">
              <strong>Type:</strong> {trailer.type}
            </p>
            <p className="flex justify-between items-center">
              <strong>Weight (Empty):</strong> {trailer.weight.empty} lbs
            </p>
            <p className="flex justify-between items-center">
              <strong>Max Load:</strong> {trailer.weight.maxLoad} lbs
            </p>
            <p className="flex justify-between items-center">
              <strong>Insurance Required:</strong>{" "}
              {trailer.insuranceRequired ? "Yes" : "No"}
            </p>
          </div>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Pricing</h2>}>
          <div className="flex flex-col gap-4">
            {trailer.rentalPrices.halfDay && (
              <p className="flex justify-between items-center">
                <strong>Half Day Rental:</strong> $
                {trailer.rentalPrices.halfDay}
              </p>
            )}
            <p className="flex justify-between items-center">
              <strong>Full Day Rental:</strong> ${trailer.rentalPrices.fullDay}
            </p>
            {trailer.weekendSurcharge && (
              <p className="flex justify-between items-center">
                <strong>Weekend Surcharge:</strong> ${trailer.weekendSurcharge}
              </p>
            )}
            <p className="flex justify-between items-center">
              <strong>Full Service Delivery Fee:</strong> ${trailer.deliveryFee}
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
              {trailer.lastMaintenanceDate
                ? trailer.lastMaintenanceDate.toLocaleDateString()
                : "2023/09/01"}
            </p>
            {trailer.nextScheduledMaintenance && (
              <p className="flex justify-between items-center">
                <strong>Next Scheduled Maintenance:</strong>{" "}
                {trailer.nextScheduledMaintenance.toLocaleDateString() || "N/A"}
              </p>
            )}
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

        <Card header={<h2 className="text-xl font-semibold">Location</h2>}>
          <p>{trailer.location.address}</p>
          {trailer.location.coordinates && (
            <p className="mt-2">
              Coordinates: {trailer.location.coordinates.latitude},{" "}
              {trailer.location.coordinates.longitude}
            </p>
          )}
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Availability</h2>}>
          <p className="flex justify-between items-center">
            <strong>Status:</strong>{" "}
            <Badge
              variant={trailer.availability.isAvailable ? "success" : "warning"}
            >
              {trailer.availability.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </p>
          {!trailer.availability.isAvailable &&
            trailer.availability.nextAvailableDate && (
              <p className="mt-2">
                Next Available:{" "}
                {trailer.availability.nextAvailableDate.toLocaleDateString()}
              </p>
            )}
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
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card
        className="mt-8"
        header={<h2 className="text-xl font-semibold">Service Types</h2>}
      >
        <ul className="flex space-x-4">
          {trailer.serviceTypes.map((type, index) => (
            <li key={index} className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span className="capitalize">{type} Service</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card
        className="mt-8"
        header={<h2 className="text-xl font-semibold">Ratings</h2>}
      >
        <div className="flex items-center space-x-2">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="font-bold">
            {trailer.ratings.averageRating.toFixed(1)}
          </span>
          <span className="text-gray-500">
            ({trailer.ratings.totalReviews} reviews)
          </span>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <Button
          size="large"
          className="w-full md:w-1/3"
          variant="primary"
          onClick={() => navigate("/contact")}
        >
          Contact Us to Rent
        </Button>
      </div>
    </div>
  );
};
