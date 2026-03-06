import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { providerAPI, categoryAPI } from "../../services/api";

function ServicesList() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [editFormData, setEditFormData] = useState({
    name: "",
    category_id: null,
    price: null,
    description: "",
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getServices();
      setServices(response.data || []);
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

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      const categoryList = (response.data || []).map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setEditFormData({
      name: service.title,
      category_id: service.category_id,
      price: service.price,
      description: service.description,
    });
    setEditErrors({});
    setShowEditDialog(true);
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.name.trim()) {
      errors.name = "Service name is required";
    } else if (editFormData.name.trim().length < 3) {
      errors.name = "Service name must be at least 3 characters";
    }

    if (!editFormData.category_id) {
      errors.category_id = "Category is required";
    }

    if (editFormData.price === null || editFormData.price === undefined) {
      errors.price = "Price is required";
    } else if (editFormData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!editFormData.description.trim()) {
      errors.description = "Description is required";
    } else if (editFormData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      await providerAPI.updateService(editingService.id, {
        title: editFormData.name,
        category_id: editFormData.category_id,
        price: editFormData.price,
        description: editFormData.description,
      });

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Service updated successfully!",
        life: 3000,
      });

      setShowEditDialog(false);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message ||
          "Failed to update service. Please try again.",
        life: 4000,
      });
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await providerAPI.deleteService(serviceToDelete.id);

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Service deleted successfully!",
        life: 3000,
      });

      setShowDeleteConfirm(false);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message ||
          "Failed to delete service. Please try again.",
        life: 4000,
      });
      setShowDeleteConfirm(false);
    }
  };

  const priceTemplate = (rowData) => {
    return `₹${rowData.price?.toLocaleString("en-IN") || 0}`;
  };

  const categoryTemplate = (rowData) => {
    return rowData.category_name || "N/A";
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => handleEditClick(rowData)}
          tooltip="Edit Service"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDeleteClick(rowData)}
          tooltip="Delete Service"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const descriptionTemplate = (rowData) => {
    const desc = rowData.description;
    return desc?.length > 50 ? `${desc.substring(0, 50)}...` : desc;
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                My Services
              </h2>
              <p className="text-gray-600">Manage and view all your services</p>
            </div>
            <Button
              label="Add Service"
              icon="pi pi-plus"
              className="bg-blue-600! hover:bg-blue-700!"
              onClick={() => navigate("/provider/add-service")}
            />
          </div>
        </div>

        {/* Services Table */}
        <Card className="shadow-xl rounded-2xl">
          {loading ? (
            <div className="text-center py-12">
              <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
              <p className="text-gray-500 mt-4">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <i className="pi pi-inbox text-4xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500 text-lg mb-4">
                No services yet. Start by adding your first service!
              </p>
              <Button
                label="Add First Service"
                icon="pi pi-plus"
                onClick={() => navigate("/provider/add-service")}
                className="bg-blue-600! hover:bg-blue-700!"
              />
            </div>
          ) : (
            <DataTable
              value={services}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              className="p-datatable-striped"
              responsiveLayout="scroll"
            >
              <Column field="title" header="Service Name" sortable />
              <Column
                field="category_name"
                header="Category"
                body={categoryTemplate}
                sortable
              />
              <Column
                field="price"
                header="Price"
                body={priceTemplate}
                sortable
              />
              <Column
                field="description"
                header="Description"
                body={descriptionTemplate}
              />
              <Column
                header="Actions"
                body={actionTemplate}
                style={{ width: "120px" }}
              />
            </DataTable>
          )}
        </Card>
      </div>

      {/* Edit Service Dialog */}
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header="Edit Service"
        modal
        style={{ width: "90vw", maxWidth: "500px" }}
      >
        <div className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Service Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={editFormData.name}
              onChange={(e) => {
                setEditFormData({ ...editFormData, name: e.target.value });
                if (editErrors.name) {
                  setEditErrors({ ...editErrors, name: "" });
                }
              }}
              placeholder="Enter service name"
              className={`w-full ${editErrors.name ? "ng-invalid" : ""}`}
            />
            {editErrors.name && (
              <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={editFormData.category_id}
              options={categories}
              disabled
              onChange={(e) => {
                setEditFormData({ ...editFormData, category_id: e.value });
                if (editErrors.category_id) {
                  setEditErrors({ ...editErrors, category_id: "" });
                }
              }}
              placeholder="Select Category"
              className={`w-full ${editErrors.category_id ? "ng-invalid" : ""}`}
            />
            {editErrors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {editErrors.category_id}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Price (₹) <span className="text-red-500!">*</span>
            </label>
            <InputNumber
              value={editFormData.price}
              onValueChange={(e) => {
                setEditFormData({ ...editFormData, price: e.value });
                if (editErrors.price) {
                  setEditErrors({ ...editErrors, price: "" });
                }
              }}
              placeholder="Enter price"
              min={0}
              mode="currency"
              currency="INR"
              locale="en-IN"
              className={`w-full ${editErrors.price ? "ng-invalid" : ""}`}
            />
            {editErrors.price && (
              <p className="text-red-500 text-sm mt-1">{editErrors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={editFormData.description}
              onChange={(e) => {
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                });
                if (editErrors.description) {
                  setEditErrors({ ...editErrors, description: "" });
                }
              }}
              rows={3}
              placeholder="Describe your service"
              className={`w-full ${editErrors.description ? "ng-invalid" : ""}`}
            />
            {editErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {editErrors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-3 justify-end  pt-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => setShowEditDialog(false)}
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSaveEdit}
            className="bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        header="Confirm Delete"
        modal
        style={{ width: "90vw", maxWidth: "400px" }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{serviceToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex gap-3 mt-6 justify-end border-t pt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDelete}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default ServicesList;
