import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

import AllServices from "./pages/customer/AllServices";
import CustomerBookingPage from "./pages/customer/CustomerBookingPage";
import ServiceDetail from "./pages/customer/ServiceDetail";

import AddService from "./pages/provider/AddService";
import Availability from "./pages/provider/Availability";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Hide navbar/footer on auth pages
  const hideRoutes = [
    "/login",
    "/signup",
    "/signup/provider",
    "/signup/customer",
    "/provider/pending",  
  ];

  const shouldHide = hideRoutes.includes(location.pathname);

  const redirectLoggedInUser = () => {
    if (!isAuthenticated) return null;

    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    } else if (user?.role === "customer") {
      return <Navigate to="/customer/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      {!shouldHide && <Navbar />}

      <Routes>
        {/* Public Routes  */}
        <Route
          path="/login"
          element={isAuthenticated ? redirectLoggedInUser() : <Login />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? redirectLoggedInUser() : <SignUpHome />}
        />
        <Route
          path="/signup/customer"
          element={
            isAuthenticated ? redirectLoggedInUser() : <SignUpCustomer />
          }
        />
        <Route
          path="/signup/provider"
          element={
            isAuthenticated ? redirectLoggedInUser() : <SignUpProvider />
          }
        />

        {/* Provider Routes */}
        <Route
          path="/provider/pending"
          element={
            <ProtectedRoute
              component={ProviderPending}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute
              component={ProviderDashboard}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path="/provider/add-service"
          element={
            <ProtectedRoute
              component={AddService}
              allowedRoles={["provider"]}
            />
          }
        />
        <Route
          path="/provider/availability"
          element={
            <ProtectedRoute
              component={Availability}
              allowedRoles={["provider"]}
            />
          }
        />

        {/*  Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute
              component={CustomerDashboard}
              allowedRoles={["customer"]}
            />
          }
        />
        <Route
          path="/customer/all-services"
          element={
            <ProtectedRoute
              component={AllServices}
              allowedRoles={["customer"]}
            />
          }
        />
        <Route
          path="/customer/my-bookings"
          element={
            <ProtectedRoute
              component={CustomerBookingPage}
              allowedRoles={["customer"]}
            />
          }
        />
        <Route
          path="/customer/details/:id"
          element={
            <ProtectedRoute
              component={ServiceDetail}
              allowedRoles={["customer"]}
            />
          }
        />

        {/*  Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              component={AdminDashboard}
              allowedRoles={["admin"]}
            />
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              redirectLoggedInUser()
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect shortcuts */}
        <Route
          path="/customer"
          element={<Navigate to="/customer/dashboard" replace />}
        />
        <Route
          path="/provider"
          element={<Navigate to="/provider/dashboard" replace />}
        />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Errors */}
        <Route path="/unauthorized" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHide && <Footer />}
    </>
  );
}

export default App;
