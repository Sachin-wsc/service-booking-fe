import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";

const ProviderPending = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400"></div>

          {/* Content */}
          <div className="px-6 sm:px-10 pb-10 text-center">
            {/* Pending Icon - Floating */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400">
                <i className="pi pi-hourglass pi-spin text-5xl text-yellow-600"></i>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Profile Under Review
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8">
              Thank you for signing up! Your provider profile is currently being verified by our admin team.
            </p>

            {/* Info Section */}
            <div className="space-y-4 mb-8">
              {/* Timeline Card */}
              <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                  📋 What Happens Next
                </h2>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1 w-1  ">
                      <span className="flex items-center justify-center h-8 rounded-full bg-blue-500! text-white text-sm font-bold">1</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Admin Reviews Your Profile</p>
                      <p className="text-sm text-gray-600">We'll verify your business details and documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1 w-1">
                      <span className="flex items-center justify-center h-8  rounded-full bg-amber-500 text-white text-sm font-bold">2</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Approval or Additional Info</p>
                      <p className="text-sm text-gray-600">Usually takes 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1 w-1">
                      <span className="flex items-center justify-center h-8 rounded-full bg-green-500! text-white text-sm font-bold">3</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Start Offering Services</p>
                      <p className="text-sm text-gray-600">Begin accepting bookings and earning</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200!">
                <div className="flex gap-3">
                  <i className="pi pi-info-circle text-yellow-600! text-xl shrink-0 mt-1"></i>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800! mb-1">Check Your Email</p>
                    <p className="text-xs text-gray-600!">We may need additional information. Please check your email for any requests from our admin team.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="pi pi-sign-out"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Questions? Contact us at <span className="font-semibold">support@servicebooking.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderPending;
