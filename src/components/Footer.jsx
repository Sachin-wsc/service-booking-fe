import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-1">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left - Description */}
          <div>
            <h2 className="text-xl font-bold text-black mb-3">
              Service Booking Platform
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Book trusted professionals quickly and easily.
            </p>
          </div>

          {/* Middle - Links */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="/services" className="hover:text-blue-400 transition">Services</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Right - Social */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">
              Follow Us
            </h3>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-blue-400 transition">Facebook</a>
              <a href="#" className="hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition">Instagram</a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Service Booking Platform. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;