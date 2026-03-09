import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import AllUsers from "./AllUsers.jsx";
import Providers from "./Providers.jsx";
import Categories from "./Categories.jsx";
import CalendarPage from "../../components/CalendarPage.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";

function AdminDashboard() {
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

        {/* SIDEBAR COMPONENT */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

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
