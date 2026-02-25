import React from "react";
import { InputText } from "primereact/inputtext";

const Address = ({ form, errors, handleChange }) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Street Field */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Street Address
        </label>
        <InputText
          name="street"
          value={form.street || ""}
          onChange={handleChange}
          placeholder="Enter street address"
          className="w-full "
          invalid={!!errors.street}
        />
        {errors.street && (
          <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.street}
          </p>
        )}
      </div>

      {/* City Field */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          City
        </label>
        <InputText
          name="city"
          value={form.city || ""}
          onChange={handleChange}
          placeholder="Enter city"
          className="w-full "
          invalid={!!errors.city}
        />
        {errors.city && (
          <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.city}
          </p>
        )}
      </div>

      {/* State Field */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          State
        </label>
        <InputText
          name="state"
          value={form.state || ""}
          onChange={handleChange}
          placeholder="Enter state or province"
          className="w-full"
          invalid={!!errors.state}
        />
        {errors.state && (
          <p className="!text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.state}
          </p>
        )}
      </div>
    </div>
  );
};

export default Address;
