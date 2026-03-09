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
import { adminAPI } from "../../services/api.js";

function AllUsers() {
  const toastRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);

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
    const roleColors = {
      admin: "danger",
      provider: "info",
      customer: "success",
    };
    return (
      <Tag
        value={rowData.role?.toUpperCase()}
        severity={roleColors[rowData.role] || "secondary"}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
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

  const statuses = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Blocked", value: "blocked" },
  ];

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Provider", value: "provider" },
    { label: "Customer", value: "customer" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesStatus && matchesRole;
  });

  return (
    <div>
      <Toast ref={toastRef} />
      
      {/* Header Section with Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Management <span className="text-gray-500 text-lg">{users.length}</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Dropdown
            value={roleFilter}
            options={roles}
            onChange={(e) => setRoleFilter(e.value)}
            placeholder="Filter by Role"
            showClear
            className="w-48"
          />
          <Dropdown
            value={statusFilter}
            options={statuses}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
            showClear
            className="w-48"
          />
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search users..."
              className="w-64"
            />
          </IconField>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
          <p className="text-gray-500 mt-4">Loading users...</p>
        </div>
      ) : errors ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="pi pi-exclamation-circle text-3xl text-red-600"></i>
          <p className="text-red-500 mt-4">{errors}</p>
        </div>
      ) : (
        <div className="card mt-2">
          <DataTable
            value={filteredUsers}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 15, 20]}
            dataKey="id"
            globalFilter={globalFilterValue}
            globalFilterFields={["name", "email", "phone", "role", "status"]}
            emptyMessage="No users found."
            className="p-datatable-sm p-datatable-gridlines p-datatable-hover"
            stripedRows
            showGridlines
            rowHover
            size="small"
          >
            <Column
              field="name"
              header="Full name"
              sortable
              style={{ width: "18%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="email"
              header="Email"
              sortable
              style={{ width: "22%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="role"
              header="Role"
              body={roleBodyTemplate}
              sortable
              style={{ width: "12%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
              style={{ width: "12%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
            <Column
              field="created_at"
              header="Joined date"
              body={dateBodyTemplate}
              sortable
              style={{ width: "20%" }}
              headerStyle={{ backgroundColor: "#E3F2FD" }}
            />
           
          </DataTable>
        </div>
      )}
    </div>
  );
}

export default AllUsers;
