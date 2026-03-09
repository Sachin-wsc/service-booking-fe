import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { logoutUser } from "../features/authSlice";
import toastUtil from "../utils/toastUtil";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const menuRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await dispatch(logoutUser());

      toastUtil.showSuccess(
        toastRef,
        "Logged Out",
        "You have been logged out successfully",
        2000
      );

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toastUtil.showError(
        toastRef,
        "Logout Failed",
        error.message || "Logout error",
        3000
      );
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const goDashboard = () => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else if (user?.role === "provider") navigate("/provider/dashboard");
    else navigate("/customer/dashboard");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const profileMenuItems = [
    {
      label: user?.name || "User",
      icon: "pi pi-user",
      disabled: true,
      className: "text-gray-600 font-semibold",
    },
    {
      separator: true,
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: handleSettings,
    },
    {
      separator: true,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  return (
    <>
      <Toast ref={toastRef} />

      {/* Apollo Style Navbar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 shadow-lg">
        <div className="px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-between">

          {/* Left Section - Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition"
            onClick={goDashboard}
          >
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 sm:h-10 object-contain"
            />

            <h1 className="text-base sm:text-lg font-bold text-white hidden sm:block">
              Service Booking
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Username */}
            {user?.name && (
              <div className="hidden md:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {user.name}
                  </p>
                  <p className="text-blue-100 text-xs capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/30"></div>

            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => menuRef.current.toggle(e)}
                className="w-30 sm:w-14 h-12 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold transition-all duration-200 border border-white/30"
                title="Profile menu"
              >
                <i className="pi pi-user text-xl sm:text-2xl"></i>
              </button>

              {/* Dropdown Menu */}
              <Menu
                model={profileMenuItems}
                popup
                ref={menuRef}
                id="profile_menu"
                className="w-48"
              />
            </div>


          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;