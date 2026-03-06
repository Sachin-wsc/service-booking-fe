import { Card } from "primereact/card";
import CalendarPage from "../../components/CalendarPage";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-5">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Provider Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your services, availability, and bookings
          </p>
        </div>

        {/* Calendar Section */}
        <Card className="shadow-lg rounded-xl">
          <CalendarPage />
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
