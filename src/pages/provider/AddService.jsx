import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputSwitch } from "primereact/inputswitch";
import { Card } from "primereact/card";

function AddService() {
  const [service, setService] = useState({
    name: "",
    category: null,
    price: null,
    duration: null,
    rating: null,
    description: "",
    active: true,
  });

  const categories = [
    { label: "Cleaning", value: "Cleaning" },
    { label: "Plumbing", value: "Plumbing" },
    { label: "Electrician", value: "Electrician" },
    { label: "Painting", value: "Painting" },
    { label: "Repairing", value: "Repairing" },
  ];

  const handleChange = (field, value) => {
    setService({ ...service, [field]: value });
  };

  const handleSubmit = () => {
    console.log(service);
  };

  const handleReset = () => {
    setService({
      name: "",
      category: null,
      price: null,
      duration: null,
      rating: null,
      description: "",
      active: true,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Add New Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Service Name</label>
              <InputText
                value={service.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter service name"
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Category</label>
              <Dropdown
                value={service.category}
                options={categories}
                onChange={(e) => handleChange("category", e.value)}
                placeholder="Select Category"
                className="w-full"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Price (₹)</label>
              <InputNumber
                value={service.price}
                onValueChange={(e) => handleChange("price", e.value)}
                mode="currency"
                currency="INR"
                locale="en-IN"
                placeholder="Enter price"
                className="w-full"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">
                Duration (Minutes)
              </label>
              <InputNumber
                value={service.duration}
                onValueChange={(e) => handleChange("duration", e.value)}
                placeholder="Enter duration"
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Active Status</label>
              <div className="flex items-center gap-3">
                <InputSwitch
                  checked={service.active}
                  onChange={(e) => handleChange("active", e.value)}
                />
                <span className="text-sm text-gray-500">
                  {service.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-medium text-gray-600">Description</label>
              <InputTextarea
                value={service.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Enter service description"
                className="w-full"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-medium text-gray-600">Service Image</label>
              <FileUpload
                mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="Upload Image"
                className="w-full"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
            <Button
              label="Reset"
              icon="pi pi-refresh"
              className="p-button-outlined"
              onClick={handleReset}
            />
            <Button
              label="Add Service"
              icon="pi pi-check"
              onClick={handleSubmit}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AddService;
