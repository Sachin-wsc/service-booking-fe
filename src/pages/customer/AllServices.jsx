import React, { useState, useMemo } from "react";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

function AllServices() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  // Dummy Data
  const services = [
    {
      id: 1,
      name: "Home Cleaning",
      category: "Cleaning",
      price: 999,
      rating: 4,
      image: "https://picsum.photos/id/66/200/300",
      description: "Professional deep cleaning for your home.",
    },
    {
      id: 2,
      name: "AC Repair",
      category: "Repair",
      price: 499,
      rating: 5,
      image: "https://picsum.photos/id/27/200/300",
      description: "Fast and reliable AC repair service.",
    },
    {
      id: 3,
      name: "Salon at Home",
      category: "Beauty",
      price: 1299,
      rating: 4,
      image: "https://picsum.photos/id/12/200/300",
      description: "Premium salon services at your doorstep.",
    },
    {
      id: 4,
      name: "Plumbing Service",
      category: "Repair",
      price: 699,
      rating: 3,
      image: "https://picsum.photos/id/13/200/300",
      description: "Expert plumbing solutions.",
    },
    {
      id: 5,
      name: "Electrician Service",
      category: "Repair",
      price: 599,
      rating: 4,
      image: "https://picsum.photos/id/27/200/300",
      description: "Certified electrician at your service.",
    },
    {
      id: 6,
      name: "Car Wash",
      category: "Cleaning",
      price: 399,
      rating: 5,
      image: "https://picsum.photos/id/28/200/300",
      description: "Complete car wash and detailing.",
    },
    {
      id: 7,
      name: "Massage Therapy",
      category: "Beauty",
      price: 1499,
      rating: 5,
      image: "https://picsum.photos/id/29/200/300",
      description: "Relaxing professional massage therapy.",
    },
    {
      id: 8,
      name: "Painting Service",
      category: "Cleaning",
      price: 1799,
      rating: 4,
      image: "https://picsum.photos/id/30/200/300",
      description: "Interior and exterior painting.",
    },
    {
      id: 9,
      name: "Gardening Service",
      category: "Cleaning",
      price: 899,
      rating: 4,
      image: "https://picsum.photos/id/69/200/300",
      description: "Professional gardening and landscaping.",
    },
  ];

  const categoryOptions = [
    { label: "All Categories", value: null },
    { label: "Cleaning", value: "Cleaning" },
    { label: "Repair", value: "Repair" },
    { label: "Beauty", value: "Beauty" },
  ];

  const sortOptions = [
    { label: "Price: Low to High", value: "low" },
    { label: "Price: High to Low", value: "high" },
  ];

  const ratingOptions = [
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
  ];

  // Filtering + Sorting
  const filteredServices = useMemo(() => {
    let data = [...services];

    if (search) {
      const cleanedSearch = search.toLowerCase().trim();

      data = data.filter((s) => s.name.toLowerCase().includes(cleanedSearch));
    }

    if (selectedCategory) {
      data = data.filter((s) => s.category === selectedCategory);
    }

    if (selectedRating) {
      data = data.filter((s) => s.rating >= selectedRating);
    }

    if (sortOrder === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [search, selectedCategory, selectedRating, sortOrder]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (selectedCategory) count++;
    if (selectedRating) count++;
    if (sortOrder) count++;
    return count;
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedRating(null);
    setSortOrder(null);
  };

  const openDialog = (service) => {
    setSelectedService(service);
    setVisible(true);
  };

  const itemTemplate = (service) => (
    <div className="p-2 sm:p-3 w-full sm:w-6 md:w-4 lg:w-3">
      <Card
        className="h-full shadow-2 border-round-2xl hover:shadow-6 transition-duration-200 cursor-pointer"
        onClick={() => openDialog(service)}
      >
        {/* IMAGE */}
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-8rem sm:h-12rem object-cover border-round-top-2xl"
        />

        {/* CONTENT */}
        <div className="flex flex-column grow p-2 sm:p-3">
          {/* Title + Category */}
          <div className="flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold m-0 line-clamp-2">
              {service.name}
            </h3>
            <Tag
              value={service.category}
              severity="info"
              className="whitespace-nowrap"
            />
          </div>

          {/* Rating */}
          <Rating value={service.rating} readOnly cancel={false} />

          {/* Spacer pushes price to bottom */}
          <div className="grow" />

          {/* Price + Button */}
          <div className="flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2 mt-3">
            <span className="text-lg sm:text-xl font-bold text-orange-500!">
              ₹{service.price}
            </span>

            <Button
              label="View"
              icon="pi pi-eye"
              className="p-button-sm p-button-warning w-full sm:w-auto"
              onClick={() => navigate(`/customer/details/${service.id}`)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        All Services
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
          value={selectedRating}
          options={ratingOptions}
          onChange={(e) => setSelectedRating(e.value)}
          placeholder="Rating"
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
      <DataView
        value={filteredServices}
        itemTemplate={itemTemplate}
        paginator
        rows={8}
        layout="grid"
      />

      {/* DETAILS DIALOG */}
      <Dialog
        header={selectedService?.name}
        visible={visible}
        style={{ width: "90vw", maxWidth: "450px" }}
        onHide={() => setVisible(false)}
        modal
      >
        {selectedService && (
          <div>
            <img
              src={selectedService.image}
              alt={selectedService.name}
              className="w-full h-40 sm:h-52 object-cover rounded-lg mb-4"
            />

            <Tag value={selectedService.category} className="mb-3" />

            <p className="text-sm sm:text-base text-gray-600 mb-3">
              {selectedService.description}
            </p>

            <Rating value={selectedService.rating} readOnly cancel={false} />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
              <span className="text-xl sm:text-2xl font-bold text-orange-500">
                ₹{selectedService.price}
              </span>

              <Button
                label="Book Now"
                icon="pi pi-calendar-plus"
                className="p-button-warning w-full sm:w-auto"
                onClick={() => navigate(`/customer/book/${selectedService.id}`)}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AllServices;
