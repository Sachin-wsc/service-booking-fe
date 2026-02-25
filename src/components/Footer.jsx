import React from "react";

function Footer() {
  return (
    <div className="bg-gray-800 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Service Booking Platform. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
