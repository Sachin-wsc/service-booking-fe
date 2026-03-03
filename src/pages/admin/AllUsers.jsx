import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { adminAPI } from "../../services/api.js";

function AllUsers() {
  const toastRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      const allUsers = response.data || [];
      setUsers(allUsers);
      setErrors(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch users";
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

  const statusBodyTemplate = (rowData) => {
    const statusColor =
      rowData.status === "active"
        ? "success"
        : rowData.status === "pending"
          ? "warning"
          : "danger";
    return <Tag value={rowData.status} severity={statusColor} />;
  };

  const roleBodyTemplate = (rowData) => {
    const roleColor = rowData.role === "provider" ? "info" : "secondary";
    return <Tag value={rowData.role?.toUpperCase()} severity={roleColor} />;
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage and view all system users
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
          <p className="text-gray-500 mt-4">Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
          <DataTable
            value={users}
            paginator
            rows={10}
            className="p-datatable-striped"
            globalFilterFields={["name", "email", "role", "status"]}
          >
            <Column field="name" header="Name" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="phone" header="Phone" />
            <Column
              field="role"
              header="Role"
              body={roleBodyTemplate}
              sortable
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
            <Column
              header="Action"
              body={(rowData) => (
                <Button label="View" icon="pi pi-eye" size="small" text />
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
  );
}

export default AllUsers;
