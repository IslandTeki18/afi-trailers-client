import * as React from "react";
import {
  TruckIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { Trailer } from "~src/types";

interface BookingDetailsSectionProps {
  trailer: Trailer;
  bookingDates: {
    start: Date;
    end: Date;
  };
  totalPrice: number;
  user: {
    name: string;
    email: string;
  };
}

export const BookingDetailsSection = (props: BookingDetailsSectionProps) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-200 h-48 w-full">
        <img
          src={props.trailer.photos?.[0]}
          alt="Trailer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <SummaryItem icon={<TruckIcon />} title="Trailer">
          <h3 className="font-semibold">{props.trailer.name}</h3>
          <p className="text-gray-600">{props.trailer.type}</p>
          <p className="text-gray-600">{props.trailer.capacity} capacity</p>
          <p className="text-gray-600">{props.trailer.dimensions}</p>
        </SummaryItem>

        <SummaryItem icon={<CalendarDaysIcon />} title="Rental Dates">
          <p>From: {props.bookingDates.start.toISOString()}</p>
          <p>To: {props.bookingDates.end.toISOString()}</p>
        </SummaryItem>

        <SummaryItem icon={<CurrencyDollarIcon />} title="Pricing">
          <p className="font-semibold">Total: ${props.totalPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            Full day rate: ${props.trailer.fullDayRentalPrice}
          </p>
          <p className="text-sm text-gray-600">
            Half day rate: ${props.trailer.halfDayRentalPrice}
          </p>
          <p className="text-sm text-gray-600">
            Weekend surcharge: ${props.trailer.weekendSurcharge}
          </p>
        </SummaryItem>

        <SummaryItem icon={<UserIcon />} title="User Information">
          <p>{props.user.name}</p>
          <p>{props.user.email}</p>
        </SummaryItem>

        <SummaryItem icon={<MapPinIcon />} title="Pick-up Location">
          <p>{props.trailer.location}</p>
        </SummaryItem>

        <SummaryItem icon={<StarIcon />} title="Features">
          <ul className="list-disc list-inside text-sm">
            {props.trailer.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </SummaryItem>

        {props.trailer.insuranceRequired && (
          <div className="mt-4 p-3 bg-yellow-100 rounded-md flex items-start">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">
                Insurance Required
              </p>
              <p className="text-sm text-yellow-700">
                Please ensure you have appropriate insurance coverage for this
                rental.
              </p>
            </div>
          </div>
        )}

        {props.trailer.towingRequirements.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold flex items-center">
              <TruckIcon className="w-5 h-5 mr-2 text-gray-600" />
              Towing Requirements:
            </h4>
            <ul className="list-disc list-inside text-sm mt-2">
              {props.trailer.towingRequirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

interface SummaryItemProps {
  icon: React.ReactElement;
  title: string;
  children: React.ReactNode;
}

const SummaryItem = ({ icon, title, children }: SummaryItemProps) => (
  <div className="flex items-start mt-4">
    <div className="flex-shrink-0 w-8 h-8 mr-3 text-gray-500">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      {children}
    </div>
  </div>
);
