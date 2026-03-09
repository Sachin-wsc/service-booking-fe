import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { adminAPI } from "../../services/api.js";

function Providers() {
  const toastRef = useRef(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingProviders();
      const allProviders = response.data || [];
      setProviders(allProviders);
      setErrors(null);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch providers";
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

  const handleApproveProvider = (providerId) => {
    confirmDialog({
      message: "Are you sure you want to approve this provider?",
      header: "Confirm Approval",
      icon: "pi pi-check-circle",
      acceptClassName: "p-button-success",
      accept: async () => {
        try {
          const response = await adminAPI.approveProvider(providerId);
          toastRef.current?.show({
            severity: "success",
            summary: "Success",
            detail: response.data?.message || "Provider approved successfully!",
          });
          await fetchProviders();
        } catch (error) {
          const errorMsg =
            error.response?.data?.message || "Failed to approve provider";
          toastRef.current?.show({
            severity: "error",
            summary: "Error",
            detail: errorMsg,
          });
        }
      },
    });
  };

  const handleRejectProvider = (providerId) => {
    confirmDialog({
      message: "Are you sure you want to reject this provider?",
      header: "Confirm Rejection",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const response = await adminAPI.blockUser(providerId);
          toastRef.current?.show({
            severity: "success",
            summary: "Success",
            detail: response.data?.message || "Provider rejected successfully!",
          });
          await fetchProviders();
        } catch (error) {
          const errorMsg =
            error.response?.data?.message || "Failed to reject provider";
          toastRef.current?.show({
            severity: "error",
            summary: "Error",
            detail: errorMsg,
          });
        }
      },
    });
  };

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      active: "success",
      approved: "success",
      pending: "warning",
      rejected: "danger",
      blocked: "danger",
    };
    return (
      <Tag
        value={rowData.status}
        severity={statusColors[rowData.status] || "info"}
        icon={
          rowData.status === "active" || rowData.status === "approved"
            ? "pi pi-check"
            : rowData.status === "pending"
              ? "pi pi-clock"
              : "pi pi-times"
        }
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          rounded
          outlined
          severity="success"
          onClick={() => handleApproveProvider(rowData.id)}
          tooltip="Approve"
          tooltipOptions={{ position: "top" }}
          disabled={rowData.status !== "pending"}
        />
        <Button
          icon="pi pi-times"
          rounded
          outlined
          severity="danger"
          onClick={() => handleRejectProvider(rowData.user_id)}
          tooltip="Reject"
          tooltipOptions={{ position: "top" }}
          disabled={rowData.status !== "pending"}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          severity="info"
          tooltip="View Details"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const statuses = [
    { label: "All", value: null },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Blocked", value: "blocked" },
  ];

  const filteredProviders = providers.filter((provider) => {
    return !statusFilter || provider.status === statusFilter;
  });

  return (
    <div>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header Section with Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Provider Management{" "}
            <span className="text-gray-500 text-lg">{providers.length}</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Review and approve provider accounts
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Dropdown
            value={statusFilter}
            options={statuses}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
            className="w-48"
          />
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search providers..."
              className="w-64"
            />
          </IconField>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
          <p className="text-gray-500 mt-4">Loading providers...</p>
        </div>
      ) : errors ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-exclamation-circle text-3xl text-red-600"></i>
          <p className="text-red-500 mt-4">{errors}</p>
        </div>
      ) : (
        <div className="card mt-2">
          <DataTable
            value={filteredProviders}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 15, 20]}
            dataKey="id"
            globalFilter={globalFilterValue}
            globalFilterFields={[
              "user_name",
              "user_email",
              "user_phone",
              "Buisness_name",
              "status",
            ]}
            emptyMessage="No providers found."
            className="p-datatable-sm p-datatable-gridlines p-datatable-hover"
            stripedRows
            showGridlines
            rowHover
            size="small"
          >
            <Column
              field="user_name"
              header="Full name"
              sortable
              style={{ width: "15%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="user_email"
              header="Email"
              sortable
              style={{ width: "20%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="user_phone"
              header="Phone"
              sortable
              style={{ width: "12%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="Buisness_name"
              header="Business Name"
              sortable
              style={{ width: "15%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
              style={{ width: "10%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="created_at"
              header="Joined date"
              body={dateBodyTemplate}
              sortable
              style={{ width: "15%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              header="Actions"
              style={{ width: "13%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
}

export default Providers;
