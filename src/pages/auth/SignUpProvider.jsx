import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import Address from "../../components/Address";

const SignUpProvider = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    Name: "",
    email: "",
    phone: "",
    serviceCategory: null,
    password: "",
    agreeTerms: false,
    street: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    email: "",
    phone: "",
    serviceCategory: "",
    password: "",
    agreeTerms: "",
    street: "",
    city: "",
    state: "",
  });

  const steps = [
    { label: "Personal Information", icon: "pi pi-user" },
    { label: "Address", icon: "pi pi-map-marker" },
  ];

  const serviceCategories = [
    { label: "Cleaning Service", value: "cleaning" },
    { label: "Plumbing", value: "plumbing" },
    { label: "Electrical", value: "electrical" },
    { label: "Painting", value: "painting" },
    { label: "Carpentry", value: "carpentry" },
    { label: "Home Repair", value: "repair" },
    { label: "Other", value: "other" },
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

  const handleDropdownChange = (e) => {
    setForm({ ...form, serviceCategory: e.value });
    if (errors.serviceCategory) {
      setErrors({ ...errors, serviceCategory: "" });
    }
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, agreeTerms: e.target.checked });
    if (errors.agreeTerms) {
      setErrors({ ...errors, agreeTerms: "" });
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      if (!form.Name.trim()) {
        newErrors.Name = "Name is required";
      } else if (form.Name.trim().length < 3) {
        newErrors.Name = "Name must be at least 3 characters";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(form.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!form.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!form.serviceCategory) {
        newErrors.serviceCategory = "Please select a service category";
      }

      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!form.agreeTerms) {
        newErrors.agreeTerms = "You must agree to terms and conditions";
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
      console.log("Provider Sign Up Data:", form);
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 px-3 sm:px-4 py-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-orange-400 via-red-400 to-pink-400 p-6 sm:p-10 items-center justify-center relative">
          <div className="text-center">
            <div className="w-48 sm:w-60 h-48 sm:h-60 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <i className="pi pi-briefcase text-5xl sm:text-6xl text-white"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
              Join As Provider
            </h2>
            <p className="text-sm sm:text-base opacity-95 text-white drop-shadow">
              Offer your services and grow your business
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Create Provider Account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Step {activeStep + 1} of {steps.length}
            </p>
          </div>

          {/* Steps Component */}
          <div className="mb-8 px-2">
            <div className="relative flex justify-between items-start">
              {/* Connector Lines */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300"></div>
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
                      className="absolute top-6 left-0 h-1 bg-orange-500 transition-all duration-300"
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
                          ? "bg-orange-500 text-white scale-110 shadow-lg"
                          : "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index < activeStep ? (
                      <i className="pi pi-check text-lg text-black"></i>
                    ) : index === activeStep ? (
                      <i className={`pi ${step.icon} text-lg text-black`}></i>
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
                            ? "text-orange-600"
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
          <div className="min-h-75">
            {activeStep === 0 ? (
              // Step 1: Personal Information
              <div className="space-y-4 sm:space-y-5">
                {/* Name Field */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Name
                  </label>
                  <InputText
                    name="Name"
                    value={form.Name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full"
                    invalid={!!errors.Name}
                  />
                  {errors.Name && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.Name}
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

                {/* Service Category Dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Service Category
                  </label>
                  <Dropdown
                    value={form.serviceCategory}
                    onChange={handleDropdownChange}
                    options={serviceCategories}
                    placeholder="Select service category"
                    className="w-full"
                    invalid={!!errors.serviceCategory}
                  />
                  {errors.serviceCategory && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.serviceCategory}
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

                {/* Terms Checkbox */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={form.agreeTerms}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-orange-500 rounded mt-1 cursor-pointer"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      I agree to the terms and conditions and confirm that I
                      have a valid business license
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.agreeTerms}
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
              className="flex items-center justify-center px-8 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 active:scale-95 min-w-[140px]"
            >
              <i className="pi pi-arrow-left mr-2"></i>
              Previous
            </button>

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSignUp}
                className="flex items-center justify-center px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 min-w-[140px]"
              >
                <i className="pi pi-check mr-2"></i>
                Create Account
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center justify-center px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 min-w-[140px]"
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

export default SignUpProvider;
