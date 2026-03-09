import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { providerAPI } from "../../services/api";

function Availability() {
  const toastRef = useRef(null);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const [slot, setSlot] = useState({
    date: null,
    start_time: null,
    end_time: null,
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

  const statusOptions = [
    { label: "Available", value: true },
    { label: "Booked", value: false },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getServices();
      setServices(response.data || []);
    } catch (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load services",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (serviceId) => {
    try {
      setLoading(true);
      const response = await providerAPI.getAvailability(serviceId);
      setAvailability(response.data || []);
    } catch (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load availability",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateSlot = () => {
    const errors = {};

    if (!selectedService) errors.service = "Service required";
    if (!slot.date) errors.date = "Date required";
    if (!slot.start_time) errors.start_time = "Start time required";
    if (!slot.end_time) errors.end_time = "End time required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setSlot({
      date: new Date(),
      start_time: null,
      end_time: null,
    });
    setShowDialog(true);
  };

  const handleEditSlot = (row) => {
    setSelectedSlot(row);
    setSelectedService({ id: row.service_id });

    setSlot({
      date: new Date(row.date),
      start_time: row.start_time,
      end_time: row.end_time,
    });

    setShowDialog(true);
  };

  const handleSaveSlot = async () => {
    if (!validateSlot()) return;

    const dateStr = slot.date.toISOString().split("T")[0];

    try {
      if (selectedSlot) {
        await providerAPI.updateAvailability(selectedSlot.id, {
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: selectedSlot.is_available,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Slot updated successfully",
        });
      } else {
        await providerAPI.addAvailability({
          service_id: selectedService.id,
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Created",
          detail: "Slot added successfully",
        });
      }

      setShowDialog(false);
      fetchAvailability(selectedService.id);
    } catch (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to save slot",
      });
    }
  };

  const handleDeleteSlot = async () => {
    await providerAPI.deleteAvailability(selectedSlot.id);

    setDeleteConfirm(false);

    fetchAvailability(selectedService.id);

    toastRef.current?.show({
      severity: "success",
      summary: "Deleted",
      detail: "Slot deleted",
    });
  };

  const handleToggleStatus = async (row) => {
    await providerAPI.toggleAvailabilityStatus(row.id, !row.is_available);

    fetchAvailability(selectedService.id);
  };

  const serviceOptions = services.map((service) => ({
    label: service.title,
    value: service,
  }));

  const filteredAvailability = availability.filter((slot) => {
    let match = true;

    if (statusFilter !== null) {
      match = match && slot.is_available === statusFilter;
    }

    if (dateFilter) {
      const slotDate = new Date(slot.date).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      match = match && slotDate === filterDate;
    }

    return match;
  });

  const statusBodyTemplate = (row) => (
    <Tag
      value={row.is_available ? "Available" : "Booked"}
      severity={row.is_available ? "success" : "danger"}
    />
  );

  const actionBodyTemplate = (row) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning p-button-sm"
        onClick={() => handleEditSlot(row)}
      />
      <Button
        icon={row.is_available ? "pi pi-lock-open" : "pi pi-lock"}
        className="p-button-rounded p-button-sm"
        onClick={() => handleToggleStatus(row)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => {
          setSelectedSlot(row);
          setDeleteConfirm(true);
        }}
      />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />

      <Card className="mb-6">
        <Button
          label="Add Time Slot"
          icon="pi pi-plus"
          onClick={handleAddSlot}
          className="bg-blue-600!"
        />
      </Card>

      <Card>
        {/* Filters */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <Calendar
            value={dateFilter}
            onChange={(e) => setDateFilter(e.value)}
            placeholder="Filter by Date"
            showIcon
          />

          <Dropdown
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
          />

          <Button
            label="Clear"
            icon="pi pi-filter-slash"
            className="p-button-outlined"
            onClick={() => {
              setDateFilter(null);
              setStatusFilter(null);
            }}
          />
        </div>

        <DataTable
          value={filteredAvailability}
          paginator
          rows={10}
          responsiveLayout="scroll"
        >
          <Column field="date" header="Date" sortable />
          <Column field="start_time" header="Start Time" />
          <Column field="end_time" header="End Time" />
          <Column
            field="is_available"
            header="Status"
            body={statusBodyTemplate}
          />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </Card>

      {/* Add Slot Dialog */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Add Time Slot"
        style={{ width: "450px" }}
        modal
      >
        <div className="space-y-4">
          {/* Select Service */}
          <div>
            <label className="font-semibold">Select Service</label>
            <Dropdown
              value={selectedService}
              options={serviceOptions}
              onChange={(e) => {
                setSelectedService(e.value);
                fetchAvailability(e.value.id);
              }}
              placeholder="Select Service"
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Date</label>
            <Calendar
              value={slot.date}
              onChange={(e) => setSlot({ ...slot, date: e.value })}
              className="w-full"
              minDate={new Date()}
            />
          </div>

          <div>
            <label className="font-semibold">Start Time</label>
            <Dropdown
              value={slot.start_time}
              options={timeOptions}
              onChange={(e) => setSlot({ ...slot, start_time: e.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">End Time</label>
            <Dropdown
              value={slot.end_time}
              options={timeOptions}
              onChange={(e) => setSlot({ ...slot, end_time: e.value })}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              label="Cancel"
              className="p-button-outlined"
              onClick={() => setShowDialog(false)}
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSaveSlot} />
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        visible={deleteConfirm}
        onHide={() => setDeleteConfirm(false)}
        header="Confirm Delete"
        style={{ width: "350px" }}
        modal
      >
        <p>Are you sure you want to delete this slot?</p>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            className="p-button-outlined"
            onClick={() => setDeleteConfirm(false)}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={handleDeleteSlot}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default Availability;
