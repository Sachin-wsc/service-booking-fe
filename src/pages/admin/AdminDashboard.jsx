import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { adminAPI, categoryAPI } from "../../services/api.js";
import { useRef } from "react";
import { Dialog } from "primereact/dialog";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const toastRef = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [categoryError, setCategoryError] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Real data states
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    providers: false,
    categories: false,
  });
  const [errors, setErrors] = useState({
    users: null,
    providers: null,
    categories: null,
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchUsers();
    await fetchCategories();
  };

  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true, providers: true }));
      const response = await adminAPI.getAllUsers();
      const allUsers = response.data || [];
      setUsers(allUsers);

      // Filter pending providers from users list (role === 'provider' or 'Provider' and status === 'pending')
      const pendingProviders = allUsers.filter(
        (user) =>
          user.role &&
          user.role.toLowerCase() === "provider" &&
          user.status === "pending",
      );
      setProviders(pendingProviders);

      setErrors((prev) => ({ ...prev, users: null, providers: null }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch users";
      setErrors((prev) => ({ ...prev, users: errorMsg, providers: errorMsg }));
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    } finally {
      setLoading((prev) => ({ ...prev, users: false, providers: false }));
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }));
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
      setErrors((prev) => ({ ...prev, categories: null }));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch categories";
      setErrors((prev) => ({ ...prev, categories: errorMsg }));
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
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

  const handleApproveProvider = async (providerId) => {
    console.log("Approving provider:", providerId);

    try {
      const response = await adminAPI.approveProvider(providerId);

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: response.data?.message || "Provider approved successfully!",
      });

      await fetchUsers();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to approve provider";

      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    }
  };

  const handleBlockProvider = async (provider_id) => {
    try {
      const response = await adminAPI.blockUser(provider_id);
      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: response.data?.message || "Provider rejected successfully!",
      });
      // Refresh users and providers list
      await fetchUsers();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to reject provider";
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
      });
    }
  };

  const statusBodyTemplate = (rowData) => {
    const statusColor =
      rowData.status === "active"
        ? "success"
        : rowData.status === "pending"
          ? "warning"
          : "danger";
    return <Tag value={rowData.status} severity={statusColor} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toast ref={toastRef} />
      <div className="sticky top-0 z-50 shadow-sm">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}

        {/* SIDEBAR - Desktop */}
        <div className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              {user?.name || "Admin"}
            </p>
          </div>

          <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-home text-lg"></i>
              <span>Dashboard</span>
            </button>

            {/* Categories */}
            <button
              onClick={() => setActiveTab("category")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "category"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-tag text-lg"></i>
              <span>Categories</span>
            </button>

            {/* Approve Providers */}
            <button
              onClick={() => setActiveTab("providers")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "providers"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-check-circle text-lg"></i>
              <span>Providers</span>
            </button>

            {/* Total Users */}
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-users text-lg"></i>
              <span>Users</span>
            </button>
          </nav>
        </div>

        {/* SIDEBAR - Mobile */}
        <div
          className={`fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-40 transform transition-transform duration-300 md:hidden ${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: "64px" }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              {user?.name || "Admin"}
            </p>
          </div>

          <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
            {/* Dashboard */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-home text-lg"></i>
              <span>Dashboard</span>
            </button>

            {/* Categories */}
            <button
              onClick={() => {
                setActiveTab("category");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "category"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-tag text-lg"></i>
              <span>Categories</span>
            </button>

            {/* Approve Providers */}
            <button
              onClick={() => {
                setActiveTab("providers");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "providers"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-check-circle text-lg"></i>
              <span>Providers</span>
            </button>

            {/* Total Users */}
            <button
              onClick={() => {
                setActiveTab("users");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="pi pi-users text-lg"></i>
              <span>Users</span>
            </button>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <i
                className={`pi ${showMobileMenu ? "pi-times" : "pi-bars"} text-xl`}
              ></i>
              <span>{showMobileMenu ? "Close" : "Menu"}</span>
            </button>
          </div>

          <div className="p-4 md:p-8">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                  Dashboard Overview
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Total Users */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          Total Users
                        </p>
                        <p className="text-4xl font-bold text-blue-600 mt-3">
                          {loading.users ? "..." : users.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Registered users
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <i className="pi pi-users text-3xl text-blue-500"></i>
                      </div>
                    </div>
                  </div>

                  {/* Pending Providers */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          Pending Providers
                        </p>
                        <p className="text-4xl font-bold text-blue-600 mt-3">
                          {loading.providers ? "..." : providers.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Awaiting approval
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <i className="pi pi-hourglass text-3xl text-blue-500"></i>
                      </div>
                    </div>
                  </div>

                  {/* Total Categories */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          Total Categories
                        </p>
                        <p className="text-4xl font-bold text-blue-600 mt-3">
                          {loading.categories ? "..." : categories.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Service categories
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <i className="pi pi-list text-3xl text-blue-500"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Management Tab */}
            {activeTab === "category" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      Categories Management
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Create, edit, and manage service categories
                    </p>
                  </div>
                  <Button
                    label="Add New Category"
                    icon="pi pi-plus"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: "", description: "" });
                      setCategoryError(null);
                      setShowCategoryDialog(true);
                    }}
                    severity="success"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  />
                </div>

                {/* Category List */}
                {loading.categories ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">Loading categories...</p>
                  </div>
                ) : errors.categories ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <i className="pi pi-exclamation-circle text-3xl text-red-600"></i>
                    <p className="text-red-500 mt-4">{errors.categories}</p>
                  </div>
                ) : categories.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <DataTable
                      value={categories}
                      paginator
                      rows={10}
                      className="p-datatable-striped"
                    >
                      <Column field="name" header="Category Name" sortable />
                      <Column field="description" header="Description" />
                      <Column
                        header="Actions"
                        body={(rowData) => (
                          <div className="flex gap-2">
                            <Button
                              label="Edit"
                              icon="pi pi-pencil"
                              size="small"
                              severity="info"
                              text
                              onClick={() => handleEditCategory(rowData)}
                            />
                            <Button
                              label="Delete"
                              icon="pi pi-trash"
                              size="small"
                              severity="danger"
                              text
                              onClick={() => handleDeleteCategory(rowData.id)}
                            />
                          </div>
                        )}
                      />
                    </DataTable>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <i className="pi pi-info-circle text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">
                      No categories available
                    </p>
                  </div>
                )}

                {/* Category Dialog */}
                <Dialog
                  visible={showCategoryDialog}
                  onHide={() => {
                    setShowCategoryDialog(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: "", description: "" });
                    setCategoryError(null);
                  }}
                  header={
                    editingCategory ? "Edit Category" : "Add New Category"
                  }
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
                        onClick={() => {
                          setShowCategoryDialog(false);
                          setEditingCategory(null);
                          setCategoryForm({ name: "", description: "" });
                          setCategoryError(null);
                        }}
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
            )}

            {/* Approve Providers Tab */}
            {activeTab === "providers" && (
              <div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Provider Approval
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Review and approve pending provider accounts
                  </p>
                </div>

                {errors.providers && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 mt-4">
                    <i className="pi pi-exclamation-circle text-red-600"></i>
                    <p className="text-red-700">{errors.providers}</p>
                  </div>
                )}

                {loading.providers ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
                    <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">
                      Loading pending providers...
                    </p>
                  </div>
                ) : providers.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                    <DataTable
                      value={providers}
                      paginator
                      rows={10}
                      className="p-datatable-striped"
                    >
                      <Column field="name" header="Name" sortable />
                      <Column field="email" header="Email" sortable />
                      <Column field="phone" header="Phone" />
                      <Column field="role" header="Role" sortable />
                      <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                      />
                      <Column
                        header="Action"
                        body={(rowData) => (
                          <div className="flex gap-2">
                            <Button
                              label="Approve"
                              icon="pi pi-check"
                              size="small"
                              severity="success"
                              onClick={() => handleApproveProvider(rowData.id)}
                            />
                            <Button
                              label="Reject"
                              icon="pi pi-times"
                              size="small"
                              severity="danger"
                              onClick={() => handleBlockProvider(rowData.id)}
                            />
                          </div>
                        )}
                      />
                    </DataTable>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
                    <i className="pi pi-info-circle text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">
                      No pending providers for approval
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    All Users
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage and view all system users
                  </p>
                </div>

                {errors.users && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 mt-4">
                    <i className="pi pi-exclamation-circle text-red-600"></i>
                    <p className="text-red-700">{errors.users}</p>
                  </div>
                )}

                {loading.users ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
                    <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">Loading users...</p>
                  </div>
                ) : users.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                    <DataTable
                      value={users}
                      paginator
                      rows={10}
                      className="p-datatable-striped"
                    >
                      <Column field="name" header="Name" sortable />
                      <Column field="email" header="Email" sortable />
                      <Column field="role" header="Role" sortable />
                      <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                      />
                      <Column
                        header="Action"
                        body={(rowData) => (
                          <Button
                            label="View"
                            icon="pi pi-eye"
                            size="small"
                            text
                          />
                        )}
                      />
                    </DataTable>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
                    <i className="pi pi-info-circle text-3xl text-blue-600"></i>
                    <p className="text-gray-500 mt-4">No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
