import React from "react";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ProviderDashboard = () => {
  const { user } = useSelector((state) => state.auth);

   const handleLogout = async () => {
      setIsLogoutLoading(true);
      try {
        await dispatch(logoutUser());
        navigate("/login");
      } finally {
        setIsLogoutLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Welcome, {user?.name || "Provider"}!
            </h1>
            <p className="text-gray-600">
              Manage your services and bookings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Active Bookings
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <i className="pi pi-calendar text-4xl text-blue-400 opacity-50"></i>
              </div>
            </div>

            {/* Total Services */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">0</p>
                </div>
                <i className="pi pi-briefcase text-4xl text-cyan-400 opacity-50"></i>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    $0
                  </p>
                </div>
                <i className="pi pi-wallet text-4xl text-green-400 opacity-50"></i>
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manage Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Manage Services
              </h2>
              <p className="text-gray-600 mb-4">
                Add or update your services
              </p>
              <Button
                label="Manage Services"
                className="w-full bg-blue-500 border-none"
                onClick={() => navigate("/provider/services")}
              />
            </div>

            {/* View Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                View Bookings
              </h2>
              <p className="text-gray-600 mb-4">
                Check and manage your bookings
              </p>
              <Button
                label="View Bookings"
                className="w-full bg-cyan-500 border-none"
                onClick={() => navigate("/provider/bookings")}
              />
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-10 text-center">
            <Button
              label="Logout"
              severity="danger"
              outlined
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderDashboard;