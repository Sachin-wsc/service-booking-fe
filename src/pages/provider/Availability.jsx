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

  // States
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form States
  const [slot, setSlot] = useState({
    date: null,
    start_time: null,
    end_time: null,
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Time options
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

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch availability when service changes
  useEffect(() => {
    if (selectedService) {
      fetchAvailability(selectedService.id);
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getServices();
      setServices(response.data || []);
      if (response.data?.length > 0) {
        setSelectedService(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load services",
        life: 3000,
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
      console.error("Failed to fetch availability:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load availability slots",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateSlot = () => {
    const errors = {};

    if (!slot.date) {
      errors.date = "Date is required";
    }

    if (!slot.start_time) {
      errors.start_time = "Start time is required";
    }

    if (!slot.end_time) {
      errors.end_time = "End time is required";
    }

    if (slot.start_time && slot.end_time) {
      if (slot.start_time >= slot.end_time) {
        errors.end_time = "End time must be after start time";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setSlot({
      date: null,
      start_time: null,
      end_time: null,
    });
    setFormErrors({});
    setShowDialog(true);
  };

  const handleEditSlot = (row) => {
    setSelectedSlot(row);
    setSlot({
      date: new Date(row.date),
      start_time: row.start_time,
      end_time: row.end_time,
    });
    setFormErrors({});
    setShowDialog(true);
  };

  const handleSaveSlot = async () => {
    if (!validateSlot()) {
      return;
    }

    if (!selectedService) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a service first",
        life: 3000,
      });
      return;
    }

    try {
      const dateStr = slot.date.toISOString().split("T")[0];

      if (selectedSlot) {
        // Update existing
        await providerAPI.updateAvailability(selectedSlot.id, {
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: selectedSlot.is_available,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Time slot updated successfully!",
          life: 3000,
        });
      } else {
        // Create new
        await providerAPI.addAvailability({
          service_id: selectedService.id,
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Time slot added successfully!",
          life: 3000,
        });
      }

      setShowDialog(false);
      fetchAvailability(selectedService.id);
    } catch (error) {
      console.error("Error saving slot:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message ||
          "Failed to save time slot. This slot might already exist.",
        life: 4000,
      });
    }
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlot) return;

    try {
      await providerAPI.deleteAvailability(selectedSlot.id);

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Time slot deleted successfully!",
        life: 3000,
      });

      setDeleteConfirm(false);
      setSelectedSlot(null);
      fetchAvailability(selectedService.id);
    } catch (error) {
      console.error("Error deleting slot:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to delete time slot",
        life: 4000,
      });
      setDeleteConfirm(false);
    }
  };

  const handleToggleStatus = async (row) => {
    try {
      await providerAPI.toggleAvailabilityStatus(row.id, !row.is_available);

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Slot marked as ${!row.is_available ? "available" : "booked"}!`,
        life: 3000,
      });

      fetchAvailability(selectedService.id);
    } catch (error) {
      console.error("Error updating slot status:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update slot status",
        life: 3000,
      });
    }
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.date).toLocaleDateString();
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.is_available ? "Available" : "Booked"}
        severity={rowData.is_available ? "success" : "danger"}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-sm"
          onClick={() => handleEditSlot(rowData)}
          tooltip="Edit Slot"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon={rowData.is_available ? "pi pi-lock-open" : "pi pi-lock"}
          className={`p-button-rounded p-button-sm ${
            rowData.is_available ? "p-button-info" : "p-button-secondary"
          }`}
          onClick={() => handleToggleStatus(rowData)}
          tooltip={
            rowData.is_available ? "Mark as Booked" : "Mark as Available"
          }
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => {
            setSelectedSlot(rowData);
            setDeleteConfirm(true);
          }}
          tooltip="Delete Slot"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const serviceOptions = services.map((service) => ({
    label: service.title,
    value: service,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Manage Availability
          </h1>
          <p className="text-gray-600 text-lg">
            Set your working hours and available time slots for each service
          </p>
        </div>

        {/* Service Selection */}
        <Card className="shadow-lg rounded-2xl mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="font-semibold text-gray-700 block mb-2">
                Select Service <span className="text-red-500">*</span>
              </label>
              {services.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <i className="pi pi-exclamation-circle mr-2"></i>
                  No services found. Please create a service first.
                </div>
              ) : (
                <Dropdown
                  value={selectedService}
                  options={serviceOptions}
                  onChange={(e) => setSelectedService(e.value)}
                  placeholder="Select Service"
                  className="w-full"
                  optionLabel="label"
                />
              )}
            </div>
            <Button
              label="Add Time Slot"
              icon="pi pi-plus"
              onClick={handleAddSlot}
              disabled={!selectedService}
              className="bg-blue-600! hover:bg-blue-700!"
            />
          </div>
        </Card>

        {/* Availability List */}
        <Card className="shadow-lg rounded-2xl">
          {!selectedService ? (
            <div className="text-center py-12">
              <i className="pi pi-inbox text-4xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500 text-lg">
                Select a service to view availability slots
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
              <p className="text-gray-500 mt-4">Loading slots...</p>
            </div>
          ) : availability.length === 0 ? (
            <div className="text-center py-12">
              <i className="pi pi-calendar text-4xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500 text-lg mb-4">
                No time slots added yet
              </p>
              <Button
                label="Add First Slot"
                icon="pi pi-plus"
                onClick={handleAddSlot}
                className="bg-blue-600! hover:bg-blue-700!"
              />
            </div>
          ) : (
            <DataTable
              value={availability}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              className="p-datatable-striped"
              responsiveLayout="scroll"
            >
              <Column
                field="date"
                header="Date"
                body={dateBodyTemplate}
                sortable
                style={{ width: "120px" }}
              />
              <Column
                field="start_time"
                header="Start Time"
                sortable
                style={{ width: "100px" }}
              />
              <Column
                field="end_time"
                header="End Time"
                sortable
                style={{ width: "100px" }}
              />
              <Column
                field="is_available"
                header="Status"
                body={statusBodyTemplate}
                sortable
                style={{ width: "100px" }}
              />
              <Column
                header="Actions"
                body={actionBodyTemplate}
                style={{ width: "150px" }}
              />
            </DataTable>
          )}
        </Card>
      </div>

      {/* Add/Edit Slot Dialog */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={selectedSlot ? "Edit Time Slot" : "Add Time Slot"}
        modal
        style={{ width: "90vw", maxWidth: "500px" }}
      >
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <Calendar
              value={slot.date}
              onChange={(e) => {
                setSlot({ ...slot, date: e.value });
                if (formErrors.date) {
                  setFormErrors({ ...formErrors, date: "" });
                }
              }}
              minDate={new Date()}
              dateFormat="yy-mm-dd"
              className={`w-full ${formErrors.date ? "ng-invalid" : ""}`}
            />
            {formErrors.date && (
              <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={slot.start_time}
              options={timeOptions}
              onChange={(e) => {
                setSlot({ ...slot, start_time: e.value });
                if (formErrors.start_time) {
                  setFormErrors({ ...formErrors, start_time: "" });
                }
              }}
              placeholder="Select Start Time"
              className={`w-full ${formErrors.start_time ? "ng-invalid" : ""}`}
            />
            {formErrors.start_time && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.start_time}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={slot.end_time}
              options={timeOptions}
              onChange={(e) => {
                setSlot({ ...slot, end_time: e.value });
                if (formErrors.end_time) {
                  setFormErrors({ ...formErrors, end_time: "" });
                }
              }}
              placeholder="Select End Time"
              className={`w-full ${formErrors.end_time ? "ng-invalid" : ""}`}
            />
            {formErrors.end_time && (
              <p className="text-red-500 text-sm mt-1">{formErrors.end_time}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end border-t pt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => setShowDialog(false)}
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSaveSlot}
            className="bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={deleteConfirm}
        onHide={() => setDeleteConfirm(false)}
        header="Confirm Delete"
        modal
        style={{ width: "90vw", maxWidth: "400px" }}
      >
        <p className="text-gray-600">
          Are you sure you want to delete this time slot?
        </p>

        <div className="flex gap-3 mt-6 justify-end border-t pt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
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
