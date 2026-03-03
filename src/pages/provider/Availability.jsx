import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { authAPI } from "../../services/api";

function Availability() {
  const toast = useRef(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeOptions = [
    { label: "06:00 AM", value: "06:00" },
    { label: "07:00 AM", value: "07:00" },
    { label: "08:00 AM", value: "08:00" },
    { label: "09:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "01:00 PM", value: "13:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:00 PM", value: "15:00" },
    { label: "04:00 PM", value: "16:00" },
    { label: "05:00 PM", value: "17:00" },
    { label: "06:00 PM", value: "18:00" },
    { label: "07:00 PM", value: "19:00" },
    { label: "08:00 PM", value: "20:00" },
  ];

  const initialState = daysOfWeek.reduce((acc, day) => {
    acc[day] = {
      enabled: false,
      startTime: null,
      endTime: null,
    };
    return acc;
  }, {});

  const [availability, setAvailability] = useState(initialState);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const validateTimes = () => {
    for (let day of daysOfWeek) {
      const { enabled, startTime, endTime } = availability[day];

      if (enabled && startTime && endTime) {
        if (startTime >= endTime) {
          toast.current.show({
            severity: "error",
            summary: "Invalid Time",
            detail: `${day}: End time must be after Start time`,
            life: 3000,
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateTimes()) return;

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Availability saved successfully!",
      life: 3000,
    });

    console.log("Weekly:", availability);
    console.log("Specific Dates:", selectedDates);
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <Toast ref={toast} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Weekly Availability */}
        <Card className="shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Weekly Availability
          </h2>

          {daysOfWeek.map((day, index) => (
            <div key={day}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4">
                {/* Day + Toggle */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{day}</span>
                  <InputSwitch
                    checked={availability[day].enabled}
                    onChange={(e) => handleChange(day, "enabled", e.value)}
                  />
                </div>

                {/* Start Time */}
                <Dropdown
                  value={availability[day].startTime}
                  options={timeOptions}
                  onChange={(e) => handleChange(day, "startTime", e.value)}
                  placeholder="Start Time"
                  className="w-full"
                  disabled={!availability[day].enabled}
                />

                {/* End Time */}
                <Dropdown
                  value={availability[day].endTime}
                  options={timeOptions}
                  onChange={(e) => handleChange(day, "endTime", e.value)}
                  placeholder="End Time"
                  className="w-full"
                  disabled={!availability[day].enabled}
                />
              </div>

              {index !== daysOfWeek.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        {/* Calendar Based Availability */}
        <Card className="shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Special Date Availability
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Calendar
              value={selectedDates}
              onChange={(e) => setSelectedDates(e.value)}
              selectionMode="multiple"
              readOnlyInput
              minDate={new Date()}
              className="w-full md:w-96"
              placeholder="Select available dates"
            />

            <p className="text-gray-500 text-sm">
              Select specific dates when you are available
            </p>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            label="Save Availability"
            icon="pi pi-check"
            className="px-6"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

export default Availability;
