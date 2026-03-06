import React, { useState, useMemo, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { customerAPI, categoryAPI } from "../../services/api";
import { Toast } from "primereact/toast";
import { useRef } from "react";

function AllServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const toastRef = useRef(null);

  const navigate = useNavigate();

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAllServices();
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load services",
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      const categoryList = response.data || [];
      // Create options from category data
      const options = categoryList.map((cat) => ({
        label: cat.name,
        value: cat.name,
      }));
      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const categoryOptions = [
    { label: "All Categories", value: null },
    ...categories,
  ];

  const sortOptions = [
    { label: "Price: Low to High", value: "low" },
    { label: "Price: High to Low", value: "high" },
  ];

  const availabilityOptions = [
    { label: "All Services", value: false },
    { label: "Available Only", value: true },
  ];

  // Filtering + Sorting
  const filteredServices = useMemo(() => {
    let data = [...services];

    if (search) {
      const cleanedSearch = search.toLowerCase().trim();
      data = data.filter(
        (s) =>
          s.title.toLowerCase().includes(cleanedSearch) ||
          s.provider_name.toLowerCase().includes(cleanedSearch),
      );
    }

    if (selectedCategory) {
      data = data.filter((s) => s.category_name === selectedCategory);
    }

    if (showAvailableOnly) {
      data = data.filter((s) => s.available_slots > 0);
    }

    if (sortOrder === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [search, selectedCategory, sortOrder, showAvailableOnly, services]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (selectedCategory) count++;
    if (sortOrder) count++;
    if (showAvailableOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSortOrder(null);
    setShowAvailableOnly(false);
  };

  const openDialog = (service) => {
    setSelectedService(service);
    setVisible(true);
  };

  const getAvailabilityBadge = (service) => {
    if (service.available_slots > 0) {
      return (
        <Tag
          value={`${service.available_slots} Slot${service.available_slots > 1 ? "s" : ""} Available`}
          severity="success"
          className="bg-green-600"
        />
      );
    } else {
      return <Tag value="Already Booked" severity="danger" />;
    }
  };

  const itemTemplate = (service) => (
    <div className="p-2 sm:p-3 w-full sm:w-6 md:w-4 lg:w-3">
      <Card
        className="h-full shadow-2 border-round-2xl hover:shadow-6 transition-duration-200 cursor-pointer"
        onClick={() => openDialog(service)}
      >
        {/* PLACEHOLDER IMAGE */}
        <div className="w-full h-8rem sm:h-12rem bg-gray-200 border-round-top-2xl flex items-center justify-center text-gray-400">
          <i className="pi pi-image text-4xl" />
        </div>

        {/* CONTENT */}
        <div className="flex flex-column grow p-2 sm:p-3">
          {/* Title + Category */}
          <div className="flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold m-0 line-clamp-2">
              {service.title}
            </h3>
            <Tag
              value={service.category_name}
              severity="info"
              className="whitespace-nowrap"
            />
          </div>

          {/* Provider Name */}
          <p className="text-sm text-gray-600 m-0 mb-2">
            <i className="pi pi-user mr-2" />
            {service.provider_name}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 m-0 mb-2 line-clamp-2">
            {service.description}
          </p>

          {/* Spacer pushes price to bottom */}
          <div className="grow" />

          {/* Availability Status */}
          <div className="mb-2">{getAvailabilityBadge(service)}</div>

          {/* Price + Button */}
          <div className="flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-orange-500!">
              ₹{service.price}
            </span>

            <Button
              label="View"
              icon="pi pi-eye"
              className="p-button-sm p-button-warning w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customer/details/${service.id}`);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        All Services {loading && <i className="pi pi-spin pi-spinner" />}
      </h2>

      {/* FILTER BAR */}
      <div className="bg-gray-100 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-wrap sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <Dropdown
          value={selectedCategory}
          options={categoryOptions}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Category"
          className="rounded-xl w-full sm:w-auto"
        />

        <Dropdown
          value={sortOrder}
          options={sortOptions}
          onChange={(e) => setSortOrder(e.value)}
          placeholder="Price"
          className="rounded-xl w-full sm:w-auto"
        />

        <Dropdown
          value={showAvailableOnly}
          options={availabilityOptions}
          onChange={(e) => setShowAvailableOnly(e.value)}
          placeholder="Availability"
          className="rounded-xl w-full sm:w-auto"
        />

        {/* SEARCH CENTER */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="relative w-full">
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl pr-10"
            />
            <i className="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Filter Count & Reset Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
            <Button
              icon="pi pi-filter"
              className="p-button-rounded p-button-text"
            />
            {getActiveFilterCount() > 0 && (
              <Badge
                value={getActiveFilterCount()}
                severity="warning"
                className="absolute -top-2 -right-2"
              />
            )}
          </div>

          {/* Reset */}
          <Button
            label="Reset"
            icon="pi pi-refresh"
            className="p-button-text text-sm sm:text-base"
            onClick={resetFilters}
          />
        </div>
      </div>

      {/* SERVICES GRID WITH PAGINATION */}
      {loading ? (
        <div className="flex justify-center align-items-center min-h-96">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-4xl" />
            <p className="mt-3 text-gray-600">Loading services...</p>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="flex justify-center align-items-center min-h-96">
          <div className="text-center">
            <i className="pi pi-inbox text-4xl text-gray-400" />
            <p className="mt-3 text-gray-600">No services found</p>
          </div>
        </div>
      ) : (
        <DataView
          value={filteredServices}
          itemTemplate={itemTemplate}
          paginator
          rows={8}
          layout="grid"
        />
      )}

      {/* DETAILS DIALOG */}
      <Dialog
        header={selectedService?.title}
        visible={visible}
        style={{ width: "90vw", maxWidth: "450px" }}
        onHide={() => setVisible(false)}
        modal
      >
        {selectedService && (
          <div>
            <div className="w-full h-40 sm:h-52 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              <i className="pi pi-image text-4xl" />
            </div>

            <div className="mb-3 flex gap-2">
              <Tag value={selectedService.category_name} className="mb-1" />
              {selectedService.available_slots > 0 ? (
                <Tag
                  value="Available"
                  severity="success"
                  className="bg-green-600"
                />
              ) : (
                <Tag value="Booked" severity="danger" />
              )}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Provider:</strong> {selectedService.provider_name}
            </p>

            <p className="text-sm sm:text-base text-gray-700 mb-3">
              {selectedService.description}
            </p>

            {selectedService.available_slots > 0 && (
              <p className="text-sm text-green-600 mb-3">
                <i className="pi pi-check-circle mr-2" />
                {selectedService.available_slots} slot
                {selectedService.available_slots > 1 ? "s" : ""} available
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
              <span className="text-xl sm:text-2xl font-bold text-orange-500">
                ₹{selectedService.price}
              </span>

              <Button
                label={
                  selectedService.available_slots > 0
                    ? "Book Now"
                    : "Unavailable"
                }
                icon="pi pi-calendar-plus"
                className="p-button-warning w-full sm:w-auto"
                onClick={() => {
                  if (selectedService.available_slots > 0) {
                    navigate(`/customer/book/${selectedService.id}`);
                  }
                }}
                disabled={selectedService.available_slots === 0}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AllServices;
