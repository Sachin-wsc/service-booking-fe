import React from "react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-4xl bg-gray-800! text-white hover:bg-gray-700 transition duration-200 cursor-pointer"
          >
            Go Back
          </button>

          <a
            href="/"
            className="px-6 py-2 rounded-4xl bg-blue-600! text-white hover:bg-blue-500 transition duration-200"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;  