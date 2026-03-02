import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, allowedRoles = [] }) => {
  const { isAuthenticated, user, initializing } = useSelector((state) => state.auth);

  // Show nothing while initializing
  if (initializing) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
