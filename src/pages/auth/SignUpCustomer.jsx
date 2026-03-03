import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import Address from "../../components/Address";
import { registerUser, clearError } from "../../features/authSlice";

const SignUpCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const { loading, error } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const steps = [
    { label: "Personal Information", icon: "pi pi-user" },
    { label: "Address", icon: "pi pi-map-marker" },
  ];

  // Show toast for errors
  useEffect(() => {
    if (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Registration Failed",
        detail:
          typeof error === "string"
            ? error
            : error?.message || "An error occurred during registration",
        life: 4000,
      });
    }
  }, [error]);

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

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      if (!form.name.trim()) {
        newErrors.name = "Full name is required";
      } else if (form.name.trim().length < 3) {
        newErrors.name = "Full name must be at least 3 characters";
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

      if (!form.country.trim()) {
        newErrors.country = "Country is required";
      }

      if (!form.zip.trim()) {
        newErrors.zip = "Zip code is required";
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
          role: form.role,
          street: form.street,
          city: form.city,
          state: form.state,
          country: form.country,
          zip: form.zip,
        }),
      );

      if (result.payload?.message) {
        toastRef.current?.show({
          severity: "success",
          summary: "Account Created Successfully",
          detail: "Your account has been created! Redirecting to login...",
          life: 3000,
        });
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 px-2 sm:px-4 py-2">
      <Toast ref={toastRef} />
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
              Join Now
            </h2>
            <p className="text-xs sm:text-sm opacity-95 text-white drop-shadow">
              Book services from trusted professionals in your area
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-4 sm:p-6">
          <div className="mb-2 sm:mb-3">
            <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Step {activeStep + 1} of {steps.length}
            </p>
          </div>

          {/* Steps Component */}
          <div className="mb-3 sm:mb-4">
            <Steps model={steps} activeIndex={activeStep} />
          </div>

          {/* Form Content */}
          <div>
            {activeStep === 0 ? (
              // Step 1: Personal Information
              <div className="space-y-2 sm:space-y-3">
                {/* Full Name Field */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Full Name
                  </label>
                  <InputText
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
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

export default SignUpCustomer;
