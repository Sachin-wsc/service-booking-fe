import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import { Toolbar } from "primereact/toolbar";
import { logoutUser } from "../features/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const menuRef = React.useRef(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const [menuItems] = useState([
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        // Navigate to profile page
      },
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        // Navigate to settings page
      },
    },
  ]);

  return (
    <div className="shadow-md bg-white border-b border-gray-200">
      <Toolbar
        className="bg-white px-4 py-2"
        start={
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition"
              // onClick={() => navigate("/")}
            />
            <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Service Booking
            </h1>
          </div>
        }
        end={
          <div className="flex items-center gap-3">
            {/* User Info */}
            {user?.name && (
              <div className="text-right hidden md:block pr-3 border-r border-gray-200">
                <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            )}

            {/* Menu Button */}
            <Menu model={menuItems} popup ref={menuRef} />
            <button
              onClick={(e) => menuRef.current?.toggle(e)}
              className="flex items-center justify-center w-15 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              <i className="pi pi-user"></i>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border-red-400! bg-red-500 hover:bg-red-600 text-red-500! font-semibold rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Logout"
            >
              {isLogoutLoading ? (
                <i className="pi pi-spinner pi-spin"></i>
              ) : (
                <i className="pi pi-sign-out"></i>
              )}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        }
      />
    </div>
  );
}

export default Navbar;
