import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { providerAPI } from "../../services/api";
import CalendarPage from "../../components/CalendarPage";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const servicesResponse = await providerAPI.getServices();
        setStats({
          totalServices: servicesResponse.data?.length || 0,
          totalBookings: 0, // Will be updated when booking stats endpoint is available
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Provider Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your services, availability, and bookings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Services</p>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.totalServices}
                </p>
              </div>
              <i className="pi pi-briefcase text-5xl text-blue-200"></i>
            </div>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Bookings</p>
                <p className="text-4xl font-bold text-cyan-600">
                  {stats.totalBookings}
                </p>
              </div>
              <i className="pi pi-calendar text-5xl text-cyan-200"></i>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg rounded-xl hover:shadow-xl transition">
            <div className="text-center">
              <i className="pi pi-plus text-4xl text-blue-600 mb-4 block"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Add Service
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Create a new service to offer
              </p>
              <Button
                label="Add Service"
                icon="pi pi-plus"
                onClick={() => navigate("/provider/add-service")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </Card>

          <Card className="shadow-lg rounded-xl hover:shadow-xl transition">
            <div className="text-center">
              <i className="pi pi-list text-4xl text-cyan-600 mb-4 block"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Manage Services
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                View, edit, or delete services
              </p>
              <Button
                label="My Services"
                icon="pi pi-list"
                onClick={() => navigate("/provider/services")}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              />
            </div>
          </Card>

          <Card className="shadow-lg rounded-xl hover:shadow-xl transition">
            <div className="text-center">
              <i className="pi pi-calendar text-4xl text-green-600 mb-4 block"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Availability
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Set your working hours
              </p>
              <Button
                label="Set Availability"
                icon="pi pi-calendar"
                onClick={() => navigate("/provider/availability")}
                className="w-full bg-green-600 hover:bg-green-700"
              />
            </div>
          </Card>
        </div>

        {/* Calendar Section */}
        <Card className="shadow-lg rounded-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Calendar
          </h3>
          <CalendarPage />
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;

