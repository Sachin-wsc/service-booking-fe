import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { providerAPI } from "../../services/api";

const ProviderOnboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerEmail] = useState(() => localStorage.getItem("providerEmail"));
  const [providerId] = useState(() => localStorage.getItem("providerId"));

  const [form, setForm] = useState({
    businessName: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    businessName: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (error) {
      setError(null);
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (form.businessName.trim().length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Business description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!providerEmail && !providerId) {
      setError("Session expired. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      // Use provider ID if available, otherwise use email
      const identifier = providerId || providerEmail;
      
      await providerAPI.updateProvider(identifier, {
        Buisness_name: form.businessName,
        description: form.description,
      });

      // Clear stored data after successful onboarding
      localStorage.removeItem("providerEmail");
      localStorage.removeItem("providerId");

      // Redirect to login for authentication
      navigate("/login", { 
        state: { 
          message: "Profile setup complete! Please log in with your credentials.",
          email: providerEmail 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update provider details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 px-3 sm:px-4 py-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-500 via-cyan-500 to-sky-400 p-6 sm:p-10 items-center justify-center relative">
          <div className="text-center">
            <div className="w-40 sm:w-60 h-48 sm:h-60 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-40 sm:w-52 h-40 sm:h-52 object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
              Business Setup
            </h2>
            <p className="text-sm sm:text-base opacity-95 text-white drop-shadow">
              Complete your profile to start offering services
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Tell us about your business and services
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <i className="pi pi-exclamation-circle text-red-600 mt-1"></i>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Business Name Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Business Name
              </label>
              <InputText
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                className="w-full rounded-lg"
                invalid={!!errors.businessName}
              />
              {errors.businessName && (
                <p className="text-red-600! text-sm font-medium mt-2 flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Business Description
              </label>
              <InputTextarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your business and services"
                rows={5}
                className="w-full rounded-lg"
                invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-red-600! text-sm font-medium mt-2 flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.description}
                </p>
              )}
            </div>

            <Button
              type="submit"
              label="Complete Setup"
              loading={loading}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboarding;
