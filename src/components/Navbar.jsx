import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { logoutUser } from "../features/authSlice";
import toastUtil from "../utils/toastUtil";
import { useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await dispatch(logoutUser());
      toastUtil.showSuccess(
        toastRef,
        "Logged Out",
        "You have been logged out successfully",
        2000,
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toastUtil.showError(
        toastRef,
        "Logout Failed",
        error.message || "An error occurred while logging out",
        3000,
      );
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          // { label: "Dashboard", icon: "pi pi-home", path: "/admin/dashboard" },
          // { label: "Users", icon: "pi pi-users", path: "/admin/users" },
          // { label: "Providers", icon: "pi pi-check-circle", path: "/admin/providers" },
          // { label: "Categories", icon: "pi pi-tag", path: "/admin/categories" },
        ];
      case "customer":
        return [
          {
            label: "Dashboard",
            icon: "pi pi-home",
            path: "/customer/dashboard",
          },
          {
            label: "Services",
            icon: "pi pi-list",
            path: "/customer/all-services",
          },
          {
            label: "My Bookings",
            icon: "pi pi-calendar",
            path: "/customer/my-bookings",
          },
          {
            label: "History",
            icon: "pi pi-history",
            path: "/customer/history",
          },
        ];
      case "provider":
        return [
          {
            label: "Dashboard",
            icon: "pi pi-home",
            path: "/provider/dashboard",
          },
          {
            label: "My Services",
            icon: "pi pi-list",
            path: "/provider/services",
          },
          {
            label: "Availability",
            icon: "pi pi-calendar",
            path: "/provider/availability",
          },
          {
            label: "Bookings",
            icon: "pi pi-inbox",
            path: "/provider/bookings",
          },
          {
            label: "Earnings",
            icon: "pi pi-wallet",
            path: "/provider/earnings",
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <Toast ref={toastRef} />
      <div className="sticky top-0 z-50 bg-white! shadow-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          {/* Main Navbar Container */}
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 sm:h-10 w-auto cursor-pointer hover:opacity-80 transition"
                onClick={() =>
                  navigate(
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : user?.role === "customer"
                        ? "/customer/dashboard"
                        : "/provider/dashboard",
                  )
                }
              />
              <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                Service Booking
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer ${
                    isActive(item.path)
                      ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <i className={`${item.icon} text-base`}></i>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side - User Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Info - Desktop */}
              {user?.name && (
                <div className="hidden md:flex items-center gap-3 pr-3 border-r border-gray-200">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                loading={isLogoutLoading}
                disabled={isLogoutLoading}
                icon="pi pi-sign-out"
                className="p-button-rounded p-button-danger p-button-text"
                tooltip="Logout"
                tooltipOptions={{ position: "bottom" }}
                text
              />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <i
                  className={`pi ${showMobileMenu ? "pi-times" : "pi-bars"} text-xl`}
                ></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden mt-3 space-y-1 bg-gray-50 rounded-lg p-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-3 text-sm font-medium cursor-pointer ${
                    isActive(item.path)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className={`${item.icon} text-base`}></i>
                  {item.label}
                </button>
              ))}

              {/* Mobile User Info */}
              {user?.name && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
