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
import { providerAPI, categoryAPI } from "../../services/api";

function Services() {
  const toastRef = useRef(null);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");

  const [editingService, setEditingService] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const [service, setService] = useState({
    name: "",
    category_id: null,
    price: null,
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await providerAPI.getServices();
      setServices(res.data || []);
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load services",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getCategories();

      const list = res.data.map((cat) => ({
        label: cat.name,  
        value: cat.id,
      }));

      setCategories(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (field, value) => {
    setService({ ...service, [field]: value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!service.name.trim()) newErrors.name = "Service name is required";
    else if (service.name.trim().length < 3)
      newErrors.name = "Service name must be at least 3 characters";

    if (!service.category_id) newErrors.category_id = "Category is required";

    if (service.price === null || service.price === undefined)
      newErrors.price = "Price is required";
    else if (service.price <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!service.description.trim())
      newErrors.description = "Description is required";
    else if (service.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddDialog = () => {
    setDialogMode("add");

    setService({
      name: "",
      category_id: null,
      price: null,
      description: "",
    });

    setErrors({});
    setDialogVisible(true);
  };

  const openEditDialog = (data) => {
    setDialogMode("edit");
    setEditingService(data);

    setService({
      name: data.title,
      category_id: data.category_id,
      price: data.price,
      description: data.description,
    });

    setErrors({});
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === "add") {
        await providerAPI.createService({
          title: service.name,
          category_id: service.category_id,
          price: service.price,
          description: service.description,
        });

        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Service added successfully",
        });
      } else {
        await providerAPI.updateService(editingService.id, {
          title: service.name,
          category_id: service.category_id,
          price: service.price,
          description: service.description,
        });

        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Service updated successfully",
        });
      }

      setDialogVisible(false);
      fetchServices();
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Operation failed",
      });
    }
  };

  const handleDeleteClick = (row) => {
    setServiceToDelete(row);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await providerAPI.deleteService(serviceToDelete.id);

      toastRef.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Service deleted successfully",
      });

      fetchServices();
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Delete failed",
      });
    }

    setDeleteDialog(false);
  };

  const priceTemplate = (row) => `₹${row.price?.toLocaleString("en-IN")}`;

  const descriptionTemplate = (row) => {
    const desc = row.description;
    return desc?.length > 50 ? desc.substring(0, 50) + "..." : desc;
  };

  const actionTemplate = (row) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => openEditDialog(row)}
      />

      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDeleteClick(row)}
      />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast ref={toastRef} />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">My Services</h2>
            <p className="text-gray-500">Manage and update your services</p>
          </div>

          <Button
            label="Add Service"
            icon="pi pi-plus"
            onClick={openAddDialog}
            className="bg-blue-600! hover:bg-blue-700!"
          />
        </div>

        <Card>
          <DataTable
            value={services}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
          >
            <Column field="title" header="Service Name" sortable />

            <Column field="category_name" header="Category" />

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

            <Column header="Actions" body={actionTemplate} />
          </DataTable>
        </Card>
      </div>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        header={dialogMode === "add" ? "Add Service" : "Edit Service"}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: "500px" }}
        modal
      >
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Service Name *</label>

            <InputText
              value={service.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full ${errors.name ? "p-invalid" : ""}`}
            />

            {errors.name && (
              <small className="text-red-500">{errors.name}</small>
            )}
          </div>

          <div>
            <label className="font-semibold">Category *</label>

            <Dropdown
              value={service.category_id}
              options={categories}
              // disabled
              onChange={(e) => handleChange("category_id", e.value)}
              className={`w-full ${errors.category_id ? "p-invalid" : ""}`}
            />

            {errors.category_id && (
              <small className="text-red-500">{errors.category_id}</small>
            )}
          </div>

          <div>
            <label className="font-semibold">Price *</label>

            <InputNumber
              value={service.price}
              onValueChange={(e) => handleChange("price", e.value)}
              mode="currency"
              currency="INR"
              locale="en-IN"
              className={`w-full ${errors.price ? "p-invalid" : ""}`}
            />

            {errors.price && (
              <small className="text-red-500">{errors.price}</small>
            )}
          </div>

          <div>
            <label className="font-semibold">Description *</label>

            <InputTextarea
              rows={3}
              value={service.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`w-full ${errors.description ? "p-invalid" : ""}`}
            />

            {errors.description && (
              <small className="text-red-500">{errors.description}</small>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            label="Cancel"
            className="p-button-outlined"
            onClick={() => setDialogVisible(false)}
          />

          <Button
            label={dialogMode === "add" ? "Add" : "Save"}
            icon="pi pi-check"
            onClick={handleSave}
            className="bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </Dialog>

      {/* DELETE DIALOG */}

      <Dialog
        header="Confirm Delete"
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        style={{ width: "350px" }}
      >
        <p>
          Are you sure you want to delete
          <b> {serviceToDelete?.title}</b> ?
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" onClick={() => setDeleteDialog(false)} />

          <Button label="Delete" severity="danger" onClick={confirmDelete} />
        </div>
      </Dialog>
    </div>
  );
}

export default Services;
