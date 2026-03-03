import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { adminAPI } from "../../services/api.js";

function Providers() {
  const toastRef = useRef(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      const allUsers = response.data || [];

      // Filter pending providers from users list
      const pendingProviders = allUsers.filter(
        (user) =>
          user.role &&
          user.role.toLowerCase() === "provider" &&
          user.status === "pending",
      );
      setProviders(pendingProviders);
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

  const handleApproveProvider = async (providerId) => {
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
  };

  const handleRejectProvider = async (providerId) => {
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
    <div>
      <Toast ref={toastRef} />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Provider Approval</h1>
        <p className="text-gray-600 text-sm mt-1">
          Review and approve pending provider accounts
        </p>
      </div>

      {errors && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 mt-4">
          <i className="pi pi-exclamation-circle text-red-600"></i>
          <p className="text-red-700">{errors}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
          <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
          <p className="text-gray-500 mt-4">Loading pending providers...</p>
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
                    onClick={() => handleRejectProvider(rowData.id)}
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
  );
}

export default Providers;
