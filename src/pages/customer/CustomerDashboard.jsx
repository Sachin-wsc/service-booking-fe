import React from "react";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Welcome, {user?.name || "Customer"}!
            </h1>
            <p className="text-gray-600">Book services and manage your appointments</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Bookings Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Active Bookings</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <i className="pi pi-calendar text-4xl text-blue-400 opacity-50"></i>
              </div>
            </div>

            {/* Completed Services Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Completed Services</p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">0</p>
                </div>
                <i className="pi pi-check-circle text-4xl text-cyan-400 opacity-50"></i>
              </div>
            </div>

            {/* Total Spent Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
                </div>
                <i className="pi pi-wallet text-4xl text-green-400 opacity-50"></i>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Browse Services</h2>
              <p className="text-gray-600 mb-4">Explore available services in your area</p>
              <Button label="Browse Now" className="w-full bg-blue-500" />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h2>
              <p className="text-gray-600 mb-4">View and manage your bookings</p>
              <Button label="View Bookings" className="w-full bg-cyan-500" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
