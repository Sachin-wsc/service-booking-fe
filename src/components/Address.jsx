import React from "react";
import { InputText } from "primereact/inputtext";

const Address = ({ form, errors, handleChange }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Street Field */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Street Address
        </label>
        <InputText
          name="street"
          value={form.street || ""}
          onChange={handleChange}
          placeholder="Enter street address"
          className="w-full text-sm"
          invalid={!!errors.street}
        />
        {errors.street && (
          <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.street}
          </p>
        )}
      </div>

      {/* City Field */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          City
        </label>
        <InputText
          name="city"
          value={form.city || ""}
          onChange={handleChange}
          placeholder="Enter city"
          className="w-full text-sm"
          invalid={!!errors.city}
        />
        {errors.city && (
          <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.city}
          </p>
        )}
      </div>

      {/* State Field */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          State
        </label>
        <InputText
          name="state"
          value={form.state || ""}
          onChange={handleChange}
          placeholder="Enter state"
          className="w-full text-sm"
          invalid={!!errors.state}
        />
        {errors.state && (
          <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.state}
          </p>
        )}
      </div>

      {/* Country Field */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Country
        </label>
        <InputText
          name="country"
          value={form.country || ""}
          onChange={handleChange}
          placeholder="Enter country"
          className="w-full text-sm"
          invalid={!!errors.country}
        />
        {errors.country && (
          <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.country}
          </p>
        )}
      </div>

      {/* Zip Code Field */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Zip Code
        </label>
        <InputText
          name="zip"
          value={form.zip || ""}
          onChange={handleChange}
          placeholder="Enter zip code"
          className="w-full text-sm"
          invalid={!!errors.zip}
        />
        {errors.zip && (
          <p className="text-red-600! text-xs font-medium mt-1 flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-xs"></i>
            {errors.zip}
          </p>
        )}
      </div>
    </div>
  );
};

export default Address;
