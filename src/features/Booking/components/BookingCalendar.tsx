import * as React from "react";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type BookingCalendarProps = {};

export const BookingCalendar = (props: BookingCalendarProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [halfDayOption, setHalfDayOption] = useState<"AM" | "PM" | "FULL">(
    "FULL"
  );
  const bookedDates = [
    // Fetch or define your booked dates here
    { start: "2023-10-15", end: "2023-10-17" },
  ];

  const handleHalfDaySelection = (option: "AM" | "PM" | "FULL") => {
    setHalfDayOption(option);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const { start, end } = selectInfo;
    // Check if the selected date range is available
    // Update the selectedDates state accordingly
    setSelectedDates([start, end]);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={true}
      select={handleDateSelect}
      events={bookedDates}
    />
  );
};
