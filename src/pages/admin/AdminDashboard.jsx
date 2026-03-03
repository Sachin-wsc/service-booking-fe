import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import AllUsers from "./AllUsers.jsx";
import Providers from "./Providers.jsx";
import Categories from "./Categories.jsx";
import CalendarPage from "../../components/CalendarPage.jsx";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const toastRef = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toast ref={toastRef} />
      

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
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
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
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
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
            {activeTab === "dashboard" && <CalendarPage />}

            {activeTab === "category" && <Categories />}

            {activeTab === "providers" && <Providers />}

            {activeTab === "users" && <AllUsers />}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
