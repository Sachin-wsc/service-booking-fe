import React from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUpHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 px-3 sm:px-4 py-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-500 via-cyan-500 to-sky-400 p-6 sm:p-10 items-center justify-center relative">
          <div className="text-center">
            <div className="w-48 sm:w-60 h-48 sm:h-60 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-40 sm:w-52 h-40 sm:h-52 object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
              Get Started!
            </h2>
            <p className="text-sm sm:text-base opacity-95 text-white drop-shadow">
              Choose your role and join our service booking platform
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Choose how you want to join
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer Option */}
            <button
              onClick={() => navigate("/signup/customer")}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 flex items-center justify-between text-sm sm:text-base"
            >
              <div className="flex items-center gap-3">
                <i className="pi pi-user text-xl"></i>
                <div className="text-left">
                  <p className="font-bold">Customer</p>
                  <p className="text-xs font-normal opacity-90">
                    Book services
                  </p>
                </div>
              </div>
              <i className="pi pi-chevron-right"></i>
            </button>

            {/* Provider Option */}
            <button
              onClick={() => navigate("/signup/provider")}
              className="w-full bg-linear-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 flex items-center justify-between text-sm sm:text-base"
            >
              <div className="flex items-center gap-3">
                <i className="pi pi-briefcase text-xl"></i>
                <div className="text-left">
                  <p className="font-bold">Service Provider</p>
                  <p className="text-xs font-normal opacity-90">
                    Offer services
                  </p>
                </div>
              </div>
              <i className="pi pi-chevron-right"></i>
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-6">
            <Link
              to="/login"
              className="hover:text-blue-600 transition font-semibold flex items-center gap-1"
            >
              <i className="pi pi-sign-in text-xs"></i>
              Already have account?{" "}
              <span className="font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:underline transition flex items-center gap-1">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpHome;
