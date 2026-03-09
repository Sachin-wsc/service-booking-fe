import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { categoryAPI } from "../../services/api.js";

function Categories() {
  const toastRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [categoryError, setCategoryError] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
      setErrors(null);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch categories";
      setErrors(errorMsg);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      setCategoryError("Category name is required");
      return;
    }
    if (!categoryForm.description.trim()) {
      setCategoryError("Description is required");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError(null);
      if (editingCategory) {
        const response = await categoryAPI.update(
          editingCategory.id,
          categoryForm,
        );
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message || "Category updated successfully!",
        });
      } else {
        const response = await categoryAPI.create(categoryForm);
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message || "Category added successfully!",
        });
      }
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
      setShowCategoryDialog(false);
      await fetchCategories();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to save category";
      setCategoryError(errorMsg);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description });
    setShowCategoryDialog(true);
    setCategoryError(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await categoryAPI.delete(categoryId);
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message || "Category deleted successfully!",
        });
        await fetchCategories();
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Failed to delete category";
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: errorMsg,
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setShowCategoryDialog(false);
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
    setCategoryError(null);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => handleEditCategory(rowData)}
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDeleteCategory(rowData.id)}
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toastRef} />
      
      {/* Header Section with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories Management
          </h1>
          <p className="text-gray-600 text-sm">
            Create, edit, and manage service categories
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search categories..."
              className="w-80"
            />
          </IconField>
          <Button
            label="Add New Category"
            icon="pi pi-plus"
             headerStyle={{ backgroundColor: "#E3F2FD " }}
            onClick={() => {
              setEditingCategory(null);
              setCategoryForm({ name: "", description: "" });
              setCategoryError(null);
              setShowCategoryDialog(true);
               
            }}
            className="bg-green-600! border-green-600! hover:bg-green-700 !"
          />
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
          <p className="text-gray-500 mt-4">Loading categories...</p>
        </div>
      ) : errors ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-exclamation-circle text-3xl text-red-600"></i>
          <p className="text-red-500 mt-4">{errors}</p>
        </div>
      ) : (
        <div className="card mt-2">
          <DataTable
            value={categories}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 15, 20]}
            dataKey="id"
            globalFilter={globalFilterValue}
            emptyMessage="No categories found."
            className="p-datatable-sm p-datatable-gridlines p-datatable-hover"
            stripedRows
            showGridlines
            rowHover
            size="small"
          >
            <Column
              field="name"
              header="Category Name"
              sortable
              style={{ width: "25%" }}
              headerStyle={{ backgroundColor: "#E3F2FD " }}
            />
            <Column
              field="description"
              header="Description"
              sortable
              style={{ width: "60%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              header="Actions"
              style={{ width: "15%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
          </DataTable>
        </div>
      )}

      {/* Category Dialog */}
      <Dialog
        visible={showCategoryDialog}
        onHide={handleCloseDialog}
        header={editingCategory ? "Edit Category" : "Add New Category"}
        modal
        style={{ width: "90vw", maxWidth: "500px" }}
        className="p-dialog-scrollable"
      >
        {categoryError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <i className="pi pi-exclamation-circle text-red-600"></i>
            <p className="text-red-700">{categoryError}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  name: e.target.value,
                })
              }
              placeholder="e.g., Plumbing, Electrical, etc."
              className="w-full"
              disabled={categoryLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
              placeholder="Describe this service category..."
              rows={4}
              className="w-full"
              disabled={categoryLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              label="Cancel"
              severity="secondary"
              outlined
              onClick={handleCloseDialog}
              disabled={categoryLoading}
            />
            <Button
              label={
                categoryLoading
                  ? editingCategory
                    ? "Updating..."
                    : "Adding..."
                  : editingCategory
                    ? "Update"
                    : "Add"
              }
              icon={editingCategory ? "pi pi-pencil" : "pi pi-plus"}
              onClick={handleAddCategory}
              loading={categoryLoading}
              disabled={categoryLoading}
              severity="success"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Categories;
