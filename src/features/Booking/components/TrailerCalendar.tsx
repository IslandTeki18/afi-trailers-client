import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";
import { Trailer } from "~src/types";
import { Badge, Button, Card, Dropdown, Input } from "~src/components";

type TrailerCalendarProps = {
  trailer: Trailer;
};

export const TrailerCalendar: React.FC<TrailerCalendarProps> = ({
  trailer,
}) => {
  const screenWidth = window.innerWidth;
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rentalType, setRentalType] = useState<"full" | "half">("full");
  const [clientInformation, setClientInformation] = useState({
    name: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const utahCountyCityOptions = [
    { value: "Alpine", label: "Alpine" },
    { value: "American Fork", label: "American Fork" },
    { value: "Cedar Hills", label: "Cedar Hills" },
    { value: "Eagle Mountain", label: "Eagle Mountain" },
    { value: "Elk Ridge", label: "Elk Ridge" },
    { value: "Highland", label: "Highland" },
    { value: "Lehi", label: "Lehi" },
    { value: "Lindon", label: "Lindon" },
    { value: "Mapleton", label: "Mapleton" },
    { value: "Orem", label: "Orem" },
    { value: "Payson", label: "Payson" },
    { value: "Pleasant Grove", label: "Pleasant Grove" },
    { value: "Provo", label: "Provo" },
    { value: "Salem", label: "Salem" },
    { value: "Santaquin", label: "Santaquin" },
    { value: "Saratoga Springs", label: "Saratoga Springs" },
    { value: "Spanish Fork", label: "Spanish Fork" },
    { value: "Springville", label: "Springville" },
    { value: "Woodland Hills", label: "Woodland Hills" },
  ];

  const dayRentalOptions = [
    { value: "half", label: "Half Day (5 Hours)" },
    { value: "full", label: "Full Day (24 Hours)" },
  ];

  const bookedEvents = useMemo(() => {
    return trailer.bookedDates.map((booking) => {
      const start = new Date(booking.startDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(booking.endDate);
      end.setHours(23, 59, 59, 999);
      return {
        start: start.toISOString(),
        end: end.toISOString(),
        display: "auto",
        overlap: false,
        color: "#eab308",
        title: "Booked",
      };
    });
  }, [trailer.bookedDates]);

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      const { start, end } = selectInfo;
      const selectedDateArray: Date[] = [];
      let current = new Date(start);

      while (current < end) {
        if (isDateSelectable(current)) {
          selectedDateArray.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }

      setSelectedDates(selectedDateArray);
      setRentalType(selectedDateArray.length === 1 ? "full" : "full");
    },
    [trailer.bookedDates]
  );

  const isDateSelectable = useCallback(
    (date: Date) => {
      return !trailer.bookedDates.some(
        (booking) =>
          date >= new Date(booking.startDate) &&
          date < new Date(booking.endDate)
      );
    },
    [trailer.bookedDates]
  );

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
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

  const handleChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div className="flex flex-col mx-auto max-w-7xl w-full">
      <h2 className="text-2xl font-bold mb-4">
        {trailer.name} - Booking Calendar
      </h2>
      {screenWidth < 770 && (
        <p className="text-sm text-gray-600 mb-4">
          Press and hold on a date to select a range of dates
        </p>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialDate={new Date()}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={bookedEvents}
        eventBackgroundColor="#eab308"
        select={handleDateSelect}
        selectOverlap={false}
        height="auto"
      />
      {selectedDates.length > 0 && (
        <Card
          className="mt-6"
          header={<h3 className="text-xl font-semibold">Booking Summary</h3>}
          footer={<Button className="w-full">Confirm Booking</Button>}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium mb-2">Selected Dates:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date) => (
                  <Badge
                    key={date.toISOString()}
                    variant={isWeekend(date) ? "danger" : "secondary"}
                  >
                    {date.toLocaleDateString()}
                    {isWeekend(date) && " (Weekend)"}
                  </Badge>
                ))}
              </div>
            </div>
            {selectedDates.length === 1 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Type:
                </label>
                <Dropdown onChange={handleChange} options={dayRentalOptions} />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * <span className="font-semibold">Full Day</span> rental only for multiple days
                </label>
              </div>
            )}
            <form className="space-y-2">
              <Input
                label="Name"
                value={clientInformation.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    name: e.target.value,
                  })
                }
              />
              <Input
                label="Phone"
                value={clientInformation.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    phone: e.target.value,
                  })
                }
              />
              <Input
                label="Email"
                value={clientInformation.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    email: e.target.value,
                  })
                }
              />
              <Input
                label="Street Address"
                value={clientInformation.address.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    address: {
                      ...clientInformation.address,
                      street: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="City"
                value={clientInformation.address.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    address: {
                      ...clientInformation.address,
                      city: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="State"
                value={clientInformation.address.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    address: {
                      ...clientInformation.address,
                      state: e.target.value,
                    },
                  })
                }
              />
              <Dropdown
                label="City"
                placeholder="Select a city"
                options={utahCountyCityOptions}
                onChange={(value) =>
                  setClientInformation({
                    ...clientInformation,
                    address: {
                      ...clientInformation.address,
                      city: value,
                    },
                  })
                }
              />
              <Input
                label="Zip"
                value={clientInformation.address.zip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClientInformation({
                    ...clientInformation,
                    address: {
                      ...clientInformation.address,
                      zip: e.target.value,
                    },
                  })
                }
              />
            </form>

            <div>
              <h4 className="text-lg font-medium mb-2">Pricing:</h4>
              <p className="text-2xl font-bold">${calculateTotalPrice()}</p>
              {trailer.weekendSurcharge && (
                <p className="text-sm text-gray-600 mt-1">
                  *Weekend surcharge of ${trailer.weekendSurcharge} per day
                  applies to Saturdays and Sundays
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
