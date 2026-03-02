import "./App.css";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./features/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import SignUpHome from "./pages/auth/SignUpHome";
import SignUpCustomer from "./pages/auth/SignUpCustomer";
import SignUpProvider from "./pages/auth/SignUpProvider";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderPending from "./pages/provider/ProviderPending";
import NotFound from "./components/NotFound";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth from stored token
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpHome />} />
      <Route path="/signup/customer" element={<SignUpCustomer />} />
      <Route path="/signup/provider" element={<SignUpProvider />} />

      {/* Provider Routes */}
      <Route
        path="/provider/pending"
        element={<ProtectedRoute component={ProviderPending} allowedRoles={["provider"]} />}
      />
      <Route
        path="/provider/dashboard"
        element={<ProtectedRoute component={ProviderDashboard} allowedRoles={["provider"]} />}
      />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={<ProtectedRoute component={CustomerDashboard} allowedRoles={["customer"]} />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      />

      {/* Default and Error Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
