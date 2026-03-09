import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";

const ProviderLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const toastRef = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith("/provider/services")) setActiveTab("services");
    else if (p.startsWith("/provider/availability")) setActiveTab("availability");
    else if (p.startsWith("/provider/bookings")) setActiveTab("bookings");
    else if (p.startsWith("/provider/reviews")) setActiveTab("reviews");
    else if (p.startsWith("/provider/profile")) setActiveTab("profile");
    else if (p.startsWith("/provider/earnings")) setActiveTab("earnings");
    else setActiveTab("dashboard");
  }, [location]);

  const navButton = (tab, icon, label, path) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium ${
        activeTab === tab
          ? "bg-white/20 text-white border-l-4 border-white shadow-lg backdrop-blur-sm"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      }`}
    >
      <i className={`pi ${icon} text-lg`}></i>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toast ref={toastRef} />

      <div className="flex flex-1 overflow-hidden relative">
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 flex-col shadow-lg">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Provider Panel</h2>
          </div>
          <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
            {navButton("dashboard", "pi-home", "Dashboard", "/provider/dashboard")}
            {navButton("services", "pi-briefcase", "My Services", "/provider/services")}
            {navButton("availability", "pi-calendar", "Availability", "/provider/availability")}
            {navButton("bookings", "pi-check-circle", "Bookings", "/provider/bookings")}
            {navButton("reviews", "pi-star", "Reviews", "/provider/reviews")}
            {navButton("profile", "pi-user", "Profile", "/provider/profile")}
            {navButton("earnings", "pi-wallet", "Earnings", "/provider/earnings")}
          </nav>
        </div>

        {/* Mobile sidebar */}
        <div
          className={`fixed left-0 top-0 w-64 h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 flex flex-col shadow-lg z-40 transform transition-transform duration-300 md:hidden ${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: "64px" }}
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Provider Panel</h2>
          </div>
          <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
            {navButton("dashboard", "pi-home", "Dashboard", "/provider/dashboard")}
            {navButton("services", "pi-briefcase", "My Services", "/provider/services")}
            {navButton("availability", "pi-calendar", "Availability", "/provider/availability")}
            {navButton("bookings", "pi-check-circle", "Bookings", "/provider/bookings")}
            {navButton("reviews", "pi-star", "Reviews", "/provider/reviews")}
            {navButton("profile", "pi-user", "Profile", "/provider/profile")}
            {navButton("earnings", "pi-wallet", "Earnings", "/provider/earnings")}
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <i className={`pi ${showMobileMenu ? "pi-times" : "pi-bars"} text-xl`}></i>
              <span>{showMobileMenu ? "Close" : "Menu"}</span>
            </button>
          </div>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderLayout;
