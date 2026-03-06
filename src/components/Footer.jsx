import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-1">
      <div className="max-w-7xl mx-auto py-6">
        {/* Divider */}
        <div className="border-t border-gray-700 my-3"></div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Service Booking Platform. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
