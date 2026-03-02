import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import { Steps } from "primereact/steps";
import Address from "../../components/Address";
import { registerUser, clearError } from "../../features/authSlice";

const SignUpProvider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    businessName: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    businessName: "",
    description: "",
  });

  const steps = [
    { label: "Personal Information", icon: "pi pi-user" },
    { label: "Address", icon: "pi pi-map-marker" },
    { label: "Business Details", icon: "pi pi-briefcase" },
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
    if (error) {
      dispatch(clearError());
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
      if (!form.name.trim()) {
        newErrors.name = "Name is required";
      } else if (form.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
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

      if (!form.country.trim()) {
        newErrors.country = "Country is required";
      }

      if (!form.zip.trim()) {
        newErrors.zip = "Zip code is required";
      }
    } else if (step === 2) {
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

  const handleSignUp = async () => {
    if (validateStep(activeStep)) {
      const result = await dispatch(
        registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: "provider",
          street: form.street,
          city: form.city,
          state: form.state,
          country: form.country,
          zip: form.zip,
          Buisness_name: form.businessName,
          description: form.description,
        })
      );

      if (result.payload?.message) {
        // Store flag for pending approval check during login
        localStorage.setItem("providerPendingApproval", form.email);
        
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please log in with your credentials.",
            email: form.email 
          } 
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 px-2 sm:px-4 py-2">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-500 via-cyan-500 to-sky-400 p-6 sm:p-8 items-center justify-center relative">
          <div className="text-center">
            <div className="w-40 sm:w-56 h-40 sm:h-56 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-5">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-36 sm:w-52 h-36 sm:h-52 object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
              Join As Provider
            </h2>
            <p className="text-xs sm:text-sm opacity-95 text-white drop-shadow">
              Offer your services and grow your business
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-4 sm:p-6">
          <div className="mb-2 sm:mb-3">
            <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create Provider Account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Step {activeStep + 1} of {steps.length}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i className="pi pi-exclamation-circle text-red-600 text-sm mt-0.5"></i>
              <p className="text-red-700 text-xs">
                {typeof error === "string" ? error : error?.message}
              </p>
            </div>
          )}

          {/* Steps Component */}
          <div className="mb-3 sm:mb-4">
            <Steps model={steps} activeIndex={activeStep} />
          </div>

          {/* Form Content */}
          <div>
            {activeStep === 0 ? (
              // Step 1: Personal Information
              <div className="space-y-2 sm:space-y-3">
                {/* Name Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Name
                  </label>
                  <InputText
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full text-sm"
                    invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <InputText
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full text-sm"
                    invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <InputMask
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    mask="99999 99999"
                    placeholder="98765 43210"
                    className="w-full text-sm"
                    invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Password
                  </label>

                  <Password
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    feedback={false}
                    inputClassName="w-full px-3 py-2 rounded-lg text-sm"
                    invalid={!!errors.password}
                    inputStyle={{
                      height: "38px",
                      width: "100%",
                      paddingRight: "19rem",
                    }}
                  />

                  {errors.password && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="bg-blue-50! p-0 sm:p-3 rounded-lg border border-blue-300!">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="agreeTerms"
                      invalid={!checked}
                      onChange={(e) => {
                        setChecked(e.checked);
                        handleCheckboxChange(e);
                      }}
                      checked={checked && form.agreeTerms}
                      className=" text-blue-500 rounded cursor-pointer"
                    ></Checkbox>

                    <label
                      htmlFor="agreeTerms"
                      className="text-xs text-gray-700 cursor-pointer"
                    >
                      I agree to the terms and conditions and confirm that I
                      have a valid business license
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              </div>
            ) : activeStep === 1 ? (
              // Step 2: Address
              <Address
                form={form}
                errors={errors}
                handleChange={handleChange}
              />
            ) : (
              // Step 3: Business Details
              <div className="space-y-2 sm:space-y-3">
                {/* Business Name Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Business Name
                  </label>
                  <InputText
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    className="w-full text-sm"
                    invalid={!!errors.businessName}
                  />
                  {errors.businessName && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Description Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Business Description
                  </label>
                  <InputTextarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your business and the services you provide"
                    rows={5}
                    className="w-full text-sm"
                    invalid={!!errors.description}
                  />
                  {errors.description && (
                    <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
                      <i className="pi pi-exclamation-circle text-xs"></i>
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-3 sm:mt-4 justify-between">
            {activeStep === 0 ? (
              <div></div>
            ) : (
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="flex items-center justify-center px-4 sm:px-6 py-2 border-2 border-blue-500 text-blue-600 font-semibold text-sm rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 active:scale-95"
              >
                <i className="pi pi-arrow-left mr-1"></i>
                Prev
              </button>
            )}

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="flex items-center justify-center px-4 sm:px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="pi pi-spinner pi-spin mr-1"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="pi pi-check mr-1"></i>
                    Submit
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center justify-center px-4 sm:px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95"
              >
                Next
                <i className="pi pi-arrow-right ml-1"></i>
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:underline transition"
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
