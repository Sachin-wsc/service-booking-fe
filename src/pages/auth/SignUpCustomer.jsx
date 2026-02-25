import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import Address from "../../components/Address";

const SignUpCustomer = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    street: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    street: "",
    city: "",
    state: "",
  });

  const steps = [
    { label: "Personal Information", icon: "pi pi-user" },
    { label: "Address", icon: "pi pi-map-marker" },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      if (!form.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (form.fullName.trim().length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(form.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!form.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else if (step === 1) {
      if (!form.street.trim()) {
        newErrors.street = "Street address is required";
      }

      if (!form.city.trim()) {
        newErrors.city = "City is required";
      }

      if (!form.state.trim()) {
        newErrors.state = "State is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSignUp = () => {
    if (validateStep(activeStep)) {
      console.log("Customer Sign Up Data:", form);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 px-3 sm:px-4 py-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-amber-400 via-yellow-400 to-orange-400 p-6 sm:p-10 items-center justify-center relative">
          <div className="text-center">
            <div className="w-48 sm:w-60 h-48 sm:h-60 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <i className="pi pi-user text-5xl sm:text-6xl text-white"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
              Join As Customer
            </h2>
            <p className="text-sm sm:text-base opacity-95 text-white drop-shadow">
              Book services from trusted professionals in your area
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Create Customer Account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Step {activeStep + 1} of {steps.length}
            </p>
          </div>

          {/* Steps Component */}
          <div className="mb-8 px-2">
            <div className="relative flex justify-between items-start">
              {/* Connector Lines */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300 z-0"></div>{" "}
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col items-center flex-1 ${
                    index < steps.length - 1 ? "" : ""
                  }`}
                >
                  {/* Active Line */}
                  {index < activeStep && (
                    <div
                      className="absolute top-6 left-0 h-1 bg-green-500 transition-all duration-300"
                      style={{
                        width:
                          index === 0
                            ? "calc(100% - 24px)"
                            : "calc(100% - 12px)",
                        marginLeft: index === 0 ? "24px" : "6px",
                      }}
                    ></div>
                  )}
                  {index === activeStep && (
                    <div
                      className="absolute top-6 left-0 h-1 bg-amber-500 transition-all duration-300"
                      style={{
                        width: "50%",
                        marginLeft: "24px",
                      }}
                    ></div>
                  )}

                  {/* Step Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                      index <= activeStep
                        ? index === activeStep
                          ? "bg-amber-500 text-white scale-110 shadow-lg"
                          : "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index < activeStep ? (
                      <i className="pi pi-check text-lg text-black font-bold"></i>
                    ) : index === activeStep ? (
                      <i className={`pi ${step.icon} text-lg`}></i>
                    ) : (
                      <span className="text-base">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                        index <= activeStep
                          ? index === activeStep
                            ? "text-amber-600"
                            : "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="min-h-[300px]">
            {activeStep === 0 ? (
              // Step 1: Personal Information
              <div className="space-y-4 sm:space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Full Name
                  </label>
                  <InputText
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full "
                    invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Email Address
                  </label>
                  <InputText
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full"
                    invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Phone Number
                  </label>
                  <InputMask
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    mask="99999 99999"
                    placeholder="98765 43210"
                    className="w-full"
                    invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Password
                  </label>

                  <Password
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    // toggleMask
                    feedback={false}
                    inputClassName="w-full px-4 py-3 rounded-lg"
                    invalid={!!errors.password}
                    inputStyle={{
                      height: "48px",
                      width: "100%",
                      paddingRight: "19rem",
                    }}
                  />

                  {errors.password && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Step 2: Address
              <Address
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 justify-between">
            <button
              onClick={handlePrev}
              disabled={activeStep === 0}
              className="flex items-center justify-center px-8 py-3 border-2 border-amber-500 text-amber-600 font-bold rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 active:scale-95 min-w-[140px]"
            >
              <i className="pi pi-arrow-left mr-2"></i>
              Previous
            </button>

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSignUp}
                className="flex items-center justify-center px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 min-w-[140px]"
              >
                <i className="pi pi-check mr-2"></i>
                Create Account
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center justify-center px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 min-w-[140px]"
              >
                Next
                <i className="pi pi-arrow-right ml-2"></i>
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent hover:underline transition"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCustomer;
