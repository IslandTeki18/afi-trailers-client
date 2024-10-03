import * as React from "react";
import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventContentArg,
  DayCellContentArg,
} from "@fullcalendar/core";
import { Trailer } from "~src/types";

type TrailerCalendarProps = {
  trailer: Trailer;
};

export const TrailerCalendar: React.FC<TrailerCalendarProps> = ({
  trailer,
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rentalType, setRentalType] = useState<"full" | "half">("full");

  const bookedEvents = useMemo(() => {
    return trailer.bookedDates.map((booking) => {
      const start = new Date(booking.startDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(booking.endDate);
      end.setHours(21, 0, 0, 0);
      return {
        start: start.toISOString(),
        end: end.toISOString(),
        display: "auto",
        editable: false,
        title: "Booked",
        color: "#eab308",
      };
    });
  }, [trailer.bookedDates]);
  console.log(bookedEvents);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const { start, end } = selectInfo;
    const selectedDateArray: Date[] = [];
    let current = new Date(start);

    while (current < end) {
      selectedDateArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    setSelectedDates(selectedDateArray);
    setRentalType(selectedDateArray.length === 1 ? "full" : "full");
  };

  const isDateSelectable = (date: Date) => {
    return !trailer.bookedDates.some(
      (booking) =>
        date >= new Date(booking.startDate) && date < new Date(booking.endDate)
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const calculateTotalPrice = () => {
    if (selectedDates.length === 0) return 0;

    let totalPrice = 0;
    const weekendSurcharge = trailer.weekendSurcharge || 0;

    if (selectedDates.length === 1) {
      totalPrice =
        rentalType === "half"
          ? trailer.halfDayRentalPrice || 0
          : trailer.fullDayRentalPrice || 0;
      if (isWeekend(selectedDates[0])) totalPrice += weekendSurcharge;
    } else {
      selectedDates.forEach((date) => {
        totalPrice += trailer.fullDayRentalPrice || 0;
        if (isWeekend(date)) totalPrice += weekendSurcharge;
      });
    }

    return totalPrice;
  };

  return (
    <div className="flex flex-col mx-auto max-w-7xl w-full">
      <h2 className="text-2xl font-bold mb-4">
        {trailer.name} - Booking Calendar
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialDate={new Date()}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true}
        dragScroll
        height="auto"
        slotDuration={"24:00"}
        selectMirror={true}
        select={handleDateSelect}
        events={bookedEvents}
        selectAllow={(selectInfo) => isDateSelectable(selectInfo.start)}
      />
      {selectedDates.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Dates:</h3>
          <ul>
            {selectedDates.map((date) => (
              <li key={date.toISOString()}>
                {date.toLocaleDateString()}
                {isWeekend(date) && (
                  <span className="text-red-500 ml-2">
                    (Weekend surcharge applies)
                  </span>
                )}
              </li>
            ))}
          </ul>
          {selectedDates.length === 1 && (
            <div className="mt-2">
              <label className="mr-2">Rental Type:</label>
              <select
                value={rentalType}
                onChange={(e) =>
                  setRentalType(e.target.value as "full" | "half")
                }
                className="border rounded p-1"
              >
                <option value="full">Full Day</option>
                <option value="half">Half Day</option>
              </select>
            </div>
          )}
          <div className="mt-2">
            <strong>Total Price: ${calculateTotalPrice()}</strong>
            {trailer.weekendSurcharge ? (
              <p className="text-sm text-gray-600">
                *Weekend surcharge of ${trailer.weekendSurcharge} per day
                applies to Saturdays and Sundays
              </p>
            ) : null}
          </div>
          <button
            onClick={() => {
              // Implement booking logic here
              console.log("Booking", {
                trailerId: trailer._id,
                dates: selectedDates,
                rentalType,
                totalPrice: calculateTotalPrice(),
              });
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};
