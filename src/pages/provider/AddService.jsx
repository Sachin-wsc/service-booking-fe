import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { providerAPI, categoryAPI } from "../../services/api";

function AddService() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryAPI.getCategories();
        const categoryList = (response.data || []).map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load categories",
          life: 3000,
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  

  const [service, setService] = useState({
    name: "",
    category_id: null,
    price: null,
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setService({ ...service, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!service.name.trim()) {
      newErrors.name = "Service name is required";
    } else if (service.name.trim().length < 3) {
      newErrors.name = "Service name must be at least 3 characters";
    }

    if (!service.category_id) {
      newErrors.category_id = "Category is required";
    }

    if (service.price === null || service.price === undefined) {
      newErrors.price = "Price is required";
    } else if (service.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!service.description.trim()) {
      newErrors.description = "Description is required";
    } else if (service.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await providerAPI.createService({
        title: service.name,
        category_id: service.category_id,
        price: service.price,
        description: service.description,
      });

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Service created successfully!",
        life: 3000,
      });

      // Reset form
      handleReset();

      // Redirect to services list after 2 seconds
      setTimeout(() => {
        navigate("/provider/services");
      }, 2000);
    } catch (error) {
      console.error("Error creating service:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message ||
          "Failed to create service. Please try again.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setService({
      name: "",
      category_id: null,
      price: null,
      description: "",
    });
    setErrors({});
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl rounded-2xl">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Add New Service
            </h2>
            <p className="text-gray-600">
              Create a new service to offer to your customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Service Name <span className="text-red-500">*</span>
              </label>
              <InputText
                value={service.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., House Cleaning"
                className={`w-full ${errors.name ? "ng-invalid ng-touched" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={service.category_id}
                options={categories}
                
                onChange={(e) => handleChange("category_id", e.value)}
                placeholder={
                  categoriesLoading
                    ? "Loading categories..."
                    : "Select Category"
                }
                className={`w-full ${
                  errors.category_id ? "ng-invalid ng-touched" : ""
                }`}
                // disabled 
              />
              {errors.category_id && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.category_id}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Price (₹) <span className="text-red-500!">*</span>
              </label>
              <InputNumber
                value={service.price}
                onValueChange={(e) => handleChange("price", e.value)}
                placeholder="Enter price"
                min={0}
                mode="currency"
                currency="INR"
                locale="en-IN"
                className={`w-full ${errors.price ? "ng-invalid ng-touched" : ""}`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.price}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <InputTextarea
                value={service.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Describe your service in detail (minimum 10 characters)"
                className={`w-full ${
                  errors.description ? "ng-invalid ng-touched" : ""
                }`}
              />
              <small className="text-gray-500">
                {service.description.length}/50 (minimum 10)
              </small>
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-4 mt-8 border-t pt-6">
            <Button
              label="Reset"
              icon="pi pi-refresh"
              className="p-button-secondary"
              onClick={handleReset}
            />
            <Button
              label="Add Service"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSubmit}
              className="bg-blue-600! hover:bg-blue-700!"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AddService;
