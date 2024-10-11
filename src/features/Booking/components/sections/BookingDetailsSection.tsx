import * as React from "react";
import { Trailer } from "~src/types";
import { CalendarIcon, TruckIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button, SectionWrapper } from "~src/components";

type BookingDetailsSectionProps = {
  confirmationId: string;
  customerName: string;
  trailer: Trailer;
  rentalPeriod: { start: Date; end: Date };
  totalPrice: number;
  serviceType: "full" | "self";
  deliveryAddress?: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pickupLocation?: string;
};

export const BookingDetailsSection: React.FC<BookingDetailsSectionProps> = ({
  confirmationId,
  customerName,
  trailer,
  rentalPeriod,
  totalPrice,
  serviceType,
  deliveryAddress,
  pickupLocation,
}) => {
  return (
    <SectionWrapper>
      <div className="flex flex-col sm:flex-row justify-between gap-4 md:items-center mb-6">
        <div>
          <p className="text-base text-gray-600">
            Confirmation Number: #{confirmationId}
          </p>
        </div>
        <div>
          <p className="text-base text-gray-600">
            Rental Start Date: {rentalPeriod.start.toLocaleDateString()}
          </p>
        </div>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold mb-4">
        Thank you for booking with Afi Trailers, {customerName}!
      </h1>
      <p className="text-gray-600 mb-6">
        {serviceType === "full"
          ? "We've received your order for full-service trailer rental. We'll reach out when your trailer is on the way."
          : "We've received your order for self-service trailer rental. Your trailer will be ready for pickup at the specified location."}
        See your rental info below. If you have any questions, feel free to
        contact us.
      </p>

      <div className="flex flex-col md:flex-row mb-6">
        <div className="w-full mb-4 md:mb-0 md:w-1/3">
          <img
            src={trailer.photos?.[0] || "/placeholder-trailer.jpg"}
            alt={trailer.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-2/3 md:pl-6">
          <h2 className="text-xl font-semibold mb-2">{trailer.name}</h2>
          <p className="text-gray-600 mb-2">Type: {trailer.type}</p>
          <p className="text-gray-600 mb-2">Capacity: {trailer.capacity}</p>
          <p className="text-gray-600 mb-2">Dimensions: {trailer.dimensions}</p>
          <div className="flex items-center mt-4">
            <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
            <p className="text-gray-600">
              {rentalPeriod.start.toLocaleDateString()} -{" "}
              {rentalPeriod.end.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Rental Price</span>
          <span className="font-semibold">
            ${trailer.fullDayRentalPrice?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Weekend Surcharge</span>
          <span className="font-semibold">
            ${trailer.weekendSurcharge?.toFixed(2)}
          </span>
        </div>
        {serviceType === "full" && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold">$XX.XX</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Total</span>
          <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Rental Details</h3>
          <p className="text-gray-600">
            <TruckIcon className="h-5 w-5 inline-block mr-2 text-gray-500" />
            Service Type:{" "}
            {serviceType === "full" ? "Full Service" : "Self-Service"}
          </p>
          {serviceType === "self" && pickupLocation && (
            <p className="text-gray-600 mt-2">
              <MapPinIcon className="h-5 w-5 inline-block mr-2 text-gray-500" />
              Pickup Location: {pickupLocation}
            </p>
          )}
        </div>
        {serviceType === "full" && deliveryAddress && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-600">{deliveryAddress.street}</p>
            <p className="text-gray-600">{deliveryAddress.suite}</p>
            <p className="text-gray-600">
              {deliveryAddress.city}, {deliveryAddress.state}{" "}
              {deliveryAddress.zipCode}
            </p>
            <p className="text-gray-600">{deliveryAddress.country}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex space-x-4">
        <Button variant="primary" size="large">
          Print Receipt
        </Button>
      </div>
    </SectionWrapper>
  );
};
