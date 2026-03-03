import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

function CalendarPage() {
  const allEvents = [
    {
      id: "1",
      title: "Meeting",
      date: "2026-03-10",
      backgroundColor: "#3B82F6",
    },
    {
      id: "2",
      title: "Client Call",
      date: "2026-03-12",
      backgroundColor: "#10B981",
    },
    {
      id: "3",
      title: "Project Deadline",
      date: "2026-03-15",
      backgroundColor: "#EF4444",
    },
  ];

  const [events, setEvents] = useState(allEvents);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventColor, setEventColor] = useState("#3B82F6");

  //  Color Options
  const colorOptions = [
    { label: "Blue", value: "#3B82F6" },
    { label: "Green", value: "#10B981" },
    { label: "Purple", value: "#8B5CF6" },
    { label: "Red", value: "#EF4444" },
    { label: "Orange", value: "#F59E0B" },
  ];

  //  set Date
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const eventsOfDay = events.filter((e) => e.date === clickedDate);
    setDayEvents(eventsOfDay);

    setEventTitle("");
    setEventColor("#3B82F6");
    setDialogVisible(true);
  };

  // Save New Event
  const handleSave = () => {
    if (!eventTitle) return;

    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: selectedDate,
      backgroundColor: eventColor,
    };

    setEvents([...events, newEvent]);
    setDayEvents([...dayEvents, newEvent]);
    setEventTitle("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Events Calendar
      </h1>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      {/* Dialog */}
      <Dialog
        header={`Events on ${selectedDate}`}
        visible={dialogVisible}
        style={{ width: "450px" }}
        modal
        onHide={() => setDialogVisible(false)}
      >
        <div className="flex flex-col gap-3">
          {/* Existing Events */}
          {dayEvents.length > 0 && (
            <>
              <h3 className="font-semibold">Existing Events</h3>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded text-white"
                  style={{ backgroundColor: event.backgroundColor }}
                >
                  {event.title}
                </div>
              ))}
              <Divider />
            </>
          )}

          {/* Add New Event */}
          <h3 className="font-semibold">Add New Event</h3>

          <InputText
            placeholder="Event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full"
          />

          <Dropdown
            value={eventColor}
            options={colorOptions}
            onChange={(e) => setEventColor(e.value)}
            placeholder="Select Color"
            className="w-full"
          />

          <Button label="Add Event" icon="pi pi-plus" onClick={handleSave} />
        </div>
      </Dialog>
    </div>
  );
}

export default CalendarPage;
