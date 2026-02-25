import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const validate = () => {
    let newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log("Login Data:", form);
      // navigate("/dashboard");
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
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-base opacity-95 text-white drop-shadow">
              Login to access your dashboard and manage your services easily.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl md:rounded-none md:rounded-r-3xl p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Login your account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your credentials to continue
            </p>
          </div>

          <form
            className="space-y-5 sm:space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Email Address
              </label>
              <InputText
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg"
                invalid={!!errors.email}
              />
              {errors.email && (
                <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                  <i className="pi pi-exclamation-circle text-xs"></i>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Password
              </label>
              <Password
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                // toggleMask
                feedback={false}
                className="w-full"
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

            <button
              type="submit"
              className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <i className="pi pi-sign-in"></i>
              Login
            </button>

            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-4 mt-4">
              <Link
                to="/signup"
                className="hover:text-orange-600 transition font-semibold flex items-center gap-1"
              >
                <i className="pi pi-user-plus text-xs"></i>
                Create Account
              </Link>
              <button
                className="hover:text-orange-600 transition font-semibold flex items-center gap-1"
                type="button"
              >
                <i className="pi pi-lock text-xs"></i>
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
